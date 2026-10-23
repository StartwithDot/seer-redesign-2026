"""DEEP collective-evaluation sculpture. Blender 5.2 headless renderer."""

import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parent
MODE = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "still"
if MODE != "still":
    raise ValueError("Expected still")


bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)


def linear(hex_color):
    channels = [int(hex_color[index:index + 2], 16) / 255 for index in (0, 2, 4)]
    linear_channels = [
        channel / 12.92 if channel <= 0.04045 else ((channel + 0.055) / 1.055) ** 2.4
        for channel in channels
    ]
    return (*linear_channels, 1.0)


def principled_material(name, color, roughness):
    material = bpy.data.materials.new(name)
    material.diffuse_color = linear(color)
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = linear(color)
    shader.inputs["Roughness"].default_value = roughness
    return material, shader


def configure_render():
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = 96
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.018
    scene.cycles.use_denoising = True
    scene.cycles.denoiser = "OPENIMAGEDENOISE"
    scene.cycles.time_limit = 65
    scene.cycles.max_bounces = 14
    scene.cycles.diffuse_bounces = 4
    scene.cycles.glossy_bounces = 7
    scene.cycles.transmission_bounces = 10
    scene.cycles.transparent_max_bounces = 10
    scene.cycles.volume_bounces = 2
    scene.cycles.caustics_reflective = True
    scene.cycles.caustics_refractive = True
    scene.cycles.sample_clamp_indirect = 8.0
    scene.render.resolution_x = 1600
    scene.render.resolution_y = 1200
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0.15
    try:
        preferences = bpy.context.preferences.addons["cycles"].preferences
        preferences.compute_device_type = "METAL"
        preferences.get_devices()
        metal_devices = [device for device in preferences.devices if device.type == "METAL"]
        for device in preferences.devices:
            device.use = device.type == "METAL"
        if metal_devices:
            scene.cycles.device = "GPU"
    except Exception:
        scene.cycles.device = "CPU"
    return scene


def configure_world():
    world = bpy.data.worlds.new("Pure white seamless studio")
    bpy.context.scene.world = world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputWorld")
    ambient = nodes.new("ShaderNodeBackground")
    ambient.inputs["Color"].default_value = linear("FFFFFF")
    ambient.inputs["Strength"].default_value = 0.35
    camera_white = nodes.new("ShaderNodeBackground")
    camera_white.inputs["Color"].default_value = linear("FFFFFF")
    camera_white.inputs["Strength"].default_value = 1.0
    light_path = nodes.new("ShaderNodeLightPath")
    mix_shader = nodes.new("ShaderNodeMixShader")
    links.new(light_path.outputs["Is Camera Ray"], mix_shader.inputs[0])
    links.new(ambient.outputs["Background"], mix_shader.inputs[1])
    links.new(camera_white.outputs["Background"], mix_shader.inputs[2])
    links.new(mix_shader.outputs["Shader"], output.inputs["Surface"])


def create_camera_only_backdrop():
    material = bpy.data.materials.new("Pure white camera backdrop")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    camera_white = nodes.new("ShaderNodeEmission")
    camera_white.inputs["Color"].default_value = linear("FFFFFF")
    camera_white.inputs["Strength"].default_value = 1.0
    invisible = nodes.new("ShaderNodeBsdfTransparent")
    light_path = nodes.new("ShaderNodeLightPath")
    visible_ray = nodes.new("ShaderNodeMath")
    visible_ray.operation = "MAXIMUM"
    mix_shader = nodes.new("ShaderNodeMixShader")
    links.new(light_path.outputs["Is Camera Ray"], visible_ray.inputs[0])
    links.new(light_path.outputs["Is Glossy Ray"], visible_ray.inputs[1])
    links.new(visible_ray.outputs["Value"], mix_shader.inputs[0])
    links.new(invisible.outputs["BSDF"], mix_shader.inputs[1])
    links.new(camera_white.outputs["Emission"], mix_shader.inputs[2])
    links.new(mix_shader.outputs["Shader"], output.inputs["Surface"])

    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 7.0, 8.0))
    backdrop = bpy.context.object
    backdrop.name = "Pure white seamless camera backdrop"
    backdrop.scale = (24.0, 12.0, 1.0)
    backdrop.rotation_euler = (math.radians(90), 0, 0)
    backdrop.data.materials.append(material)


def create_annular_base():
    material, shader = principled_material("Matte white ceramic", "F5F5F7", 0.42)
    shader.inputs["Metallic"].default_value = 0.0
    shader.inputs["IOR"].default_value = 1.47
    shader.inputs["Coat Weight"].default_value = 0.045
    shader.inputs["Coat Roughness"].default_value = 0.32
    shader.inputs["Specular IOR Level"].default_value = 0.22

    segment_count = 256
    outer_radius = 2.02
    inner_radius = 1.43
    half_height = 0.17
    profile = [
        (outer_radius, -half_height),
        (outer_radius, half_height),
        (inner_radius, half_height),
        (inner_radius, -half_height),
    ]
    vertices = []
    for radius, height in profile:
        for segment in range(segment_count):
            angle = segment * 2.0 * math.pi / segment_count
            vertices.append((radius * math.cos(angle), radius * math.sin(angle), height))
    faces = []
    for profile_index in range(4):
        next_profile = (profile_index + 1) % 4
        for segment in range(segment_count):
            next_segment = (segment + 1) % segment_count
            faces.append(
                (
                    profile_index * segment_count + segment,
                    profile_index * segment_count + next_segment,
                    next_profile * segment_count + next_segment,
                    next_profile * segment_count + segment,
                )
            )
    mesh = bpy.data.meshes.new("Precision ceramic annulus")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    base = bpy.data.objects.new("Floating ceramic evaluation ring", mesh)
    bpy.context.collection.objects.link(base)
    base.location.z = 0.18
    base.data.materials.append(material)
    bevel = base.modifiers.new("Crisp rounded ceramic edges", "BEVEL")
    bevel.width = 0.082
    bevel.segments = 5
    bevel.limit_method = "ANGLE"
    return base


def create_open_spherical_shell(name, center, outer_radius, wall, aperture_degrees, axis, material):
    theta_min = math.radians(aperture_degrees)
    theta_steps = 72
    phi_steps = 144
    theta_values = [
        theta_min + (math.pi - theta_min) * theta_index / theta_steps
        for theta_index in range(theta_steps + 1)
    ]
    vertices = []
    for radius in (outer_radius, outer_radius - wall):
        for theta in theta_values:
            for phi_index in range(phi_steps):
                phi = 2.0 * math.pi * phi_index / phi_steps
                vertices.append(
                    (
                        radius * math.sin(theta) * math.cos(phi),
                        radius * math.sin(theta) * math.sin(phi),
                        radius * math.cos(theta),
                    )
                )

    layer_size = (theta_steps + 1) * phi_steps

    def surface_index(layer, theta_index, phi_index):
        return layer * layer_size + theta_index * phi_steps + (phi_index % phi_steps)

    faces = []
    for theta_index in range(theta_steps):
        for phi_index in range(phi_steps):
            next_phi = (phi_index + 1) % phi_steps
            faces.append(
                (
                    surface_index(0, theta_index, phi_index),
                    surface_index(0, theta_index + 1, phi_index),
                    surface_index(0, theta_index + 1, next_phi),
                    surface_index(0, theta_index, next_phi),
                )
            )
            faces.append(
                (
                    surface_index(1, theta_index, next_phi),
                    surface_index(1, theta_index + 1, next_phi),
                    surface_index(1, theta_index + 1, phi_index),
                    surface_index(1, theta_index, phi_index),
                )
            )
    for theta_index in (0,):
        for phi_index in range(phi_steps):
            next_phi = (phi_index + 1) % phi_steps
            faces.append(
                (
                    surface_index(0, theta_index, phi_index),
                    surface_index(0, theta_index, next_phi),
                    surface_index(1, theta_index, next_phi),
                    surface_index(1, theta_index, phi_index),
                )
            )
    mesh = bpy.data.meshes.new(f"{name} shell mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    shell = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(shell)
    shell.data.materials.append(material)
    shell.rotation_mode = "QUATERNION"
    shell.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(axis.normalized())
    shell.location = center
    return shell


def create_aperture_rims(name, center, radius, aperture_degrees, axis, material):
    theta = math.radians(aperture_degrees)
    rim_radius = radius * math.sin(theta)
    rim_offset = radius * math.cos(theta)
    bpy.ops.mesh.primitive_torus_add(
        major_radius=rim_radius,
        minor_radius=0.008,
        major_segments=160,
        minor_segments=10,
        location=center + axis.normalized() * rim_offset,
    )
    rim = bpy.context.object
    rim.name = f"{name} polished aperture"
    rim.rotation_mode = "QUATERNION"
    rim.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(axis.normalized())
    rim.data.materials.append(material)
    for polygon in rim.data.polygons:
        polygon.use_smooth = True
    return rim


def create_glass_material(name, color, roughness, transmission, ior):
    material, shader = principled_material(name, color, roughness)
    shader.inputs["Transmission Weight"].default_value = transmission
    shader.inputs["IOR"].default_value = ior
    shader.inputs["Coat Weight"].default_value = 0.22
    shader.inputs["Coat Roughness"].default_value = 0.04
    return material


def create_luminous_core(center):
    material = bpy.data.materials.new("Warm violet-white evaluation core")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    emission = nodes.new("ShaderNodeEmission")
    emission.inputs["Color"].default_value = linear("EEE9FF")
    emission.inputs["Strength"].default_value = 4.0
    links.new(emission.outputs["Emission"], output.inputs["Surface"])
    bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=0.115, location=center)
    core = bpy.context.object
    core.name = "Small luminous considered view"
    core.data.materials.append(material)
    for polygon in core.data.polygons:
        polygon.use_smooth = True

    halo_material, halo_shader = principled_material("Violet core halo", "8E6FFF", 0.12)
    halo_shader.inputs["Transmission Weight"].default_value = 0.88
    halo_shader.inputs["IOR"].default_value = 1.12
    halo_shader.inputs["Emission Color"].default_value = linear("6C47FF")
    halo_shader.inputs["Emission Strength"].default_value = 0.25
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=0.205, location=center)
    halo = bpy.context.object
    halo.name = "Soft violet core halo"
    halo.data.materials.append(halo_material)
    for polygon in halo.data.polygons:
        polygon.use_smooth = True
    return core


def add_area_light(name, location, energy, size, color, target, shape="DISK", size_y=None):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.color = color
    data.shape = shape
    data.size = size
    if size_y is not None:
        data.size_y = size_y
    light = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(light)
    light.location = location
    light.rotation_euler = (target - Vector(location)).to_track_quat("-Z", "Y").to_euler()
    return light


scene = configure_render()
configure_world()
floor_material, floor_shader = principled_material("Glossy white seamless floor", "FFFFFF", 0.22)
floor_shader.inputs["Emission Color"].default_value = linear("FFFFFF")
floor_shader.inputs["Emission Strength"].default_value = 0.10
floor_shader.inputs["Metallic"].default_value = 0.0
floor_shader.inputs["Specular IOR Level"].default_value = 0.26
bpy.ops.mesh.primitive_plane_add(size=160, location=(0, 0, -0.012))
floor = bpy.context.object
floor.name = "Glossy white seamless studio floor"
floor.data.materials.append(floor_material)

create_annular_base()
chrome, chrome_shader = principled_material("Thin polished chrome", "E7E8ED", 0.085)
chrome_shader.inputs["Metallic"].default_value = 1.0
chrome_shader.inputs["Coat Weight"].default_value = 0.16
bpy.ops.mesh.primitive_torus_add(
    major_radius=1.725,
    minor_radius=0.014,
    major_segments=192,
    minor_segments=10,
    location=(0, 0, 0.355),
)
chrome_inlay = bpy.context.object
chrome_inlay.name = "Ceramic ring polished chrome inlay"
chrome_inlay.data.materials.append(chrome)
for polygon in chrome_inlay.data.polygons:
    polygon.use_smooth = True

center = Vector((0, 0, 2.34))
outer_axis = Vector((-0.46, -0.85, 0.25)).normalized()
middle_axis = Vector((0.48, -0.82, 0.31)).normalized()
inner_axis = Vector((-0.12, -0.96, 0.25)).normalized()
outer_glass = create_glass_material("Outer clear violet optical glass", "F5F2FF", 0.018, 1.0, 1.45)
middle_glass = create_glass_material("Middle pale violet optical glass", "AA80FF", 0.022, 1.0, 1.46)
inner_glass = create_glass_material("Inner deep violet optical glass", "6C47FF", 0.025, 1.0, 1.48)

shell_specs = [
    ("Outer clear model shell", 1.52, 0.055, 64.0, outer_axis, outer_glass),
    ("Middle pale violet model shell", 1.19, 0.055, 60.0, middle_axis, middle_glass),
    ("Inner deep violet model shell", 0.86, 0.085, 62.0, inner_axis, inner_glass),
]
for name, radius, wall, aperture, axis, material in shell_specs:
    create_open_spherical_shell(name, center, radius, wall, aperture, axis, material)
    create_aperture_rims(name, center, radius, aperture, axis, chrome)

create_luminous_core(center)

key_light = add_area_light(
    "Large upper-left ceramic key",
    (-5.2, -5.8, 9.2),
    950,
    7.0,
    (1.0, 0.985, 0.97),
    center,
)
add_area_light(
    "Broad right white fill",
    (5.8, -1.8, 5.8),
    120,
    6.0,
    (0.97, 0.98, 1.0),
    center,
)
add_area_light(
    "Soft overhead studio wrap",
    (0.2, 1.8, 10.0),
    220,
    7.0,
    (1.0, 1.0, 1.0),
    center,
)
add_area_light(
    "Long white glass highlight strip",
    (-1.2, -7.0, 5.0),
    380,
    5.0,
    (1.0, 1.0, 1.0),
    center,
    shape="RECTANGLE",
    size_y=0.12,
)
add_area_light(
    "Narrow violet transmission strip",
    (5.5, 1.5, 4.0),
    180,
    3.8,
    linear("6C47FF")[:3],
    center,
    shape="RECTANGLE",
    size_y=0.15,
)
add_area_light(
    "Rear white glass rim strip",
    (-4.0, 3.8, 5.5),
    155,
    4.2,
    (1.0, 1.0, 1.0),
    center,
    shape="RECTANGLE",
    size_y=0.13,
)

core_light_data = bpy.data.lights.new("Violet core illumination", "POINT")
core_light_data.energy = 3
core_light_data.color = linear("8A6BFF")[:3]
core_light_data.shadow_soft_size = 0.48
core_light = bpy.data.objects.new("Violet core illumination", core_light_data)
bpy.context.collection.objects.link(core_light)
core_light.location = center

bpy.ops.object.camera_add(location=(0, -14.35, 6.9))
camera = bpy.context.object
camera.name = "Premium product camera"
camera_target = Vector((0, 0, 1.62))
camera.rotation_euler = (camera_target - camera.location).to_track_quat("-Z", "Y").to_euler()
camera.data.lens = 64
camera.data.sensor_width = 36
camera.data.dof.use_dof = True
camera.data.dof.focus_object = None
camera.data.dof.focus_distance = (center - camera.location).length
camera.data.dof.aperture_fstop = 13.0
camera.data.dof.aperture_blades = 8
scene.camera = camera

scene.render.filepath = str(ROOT / "out.png")
bpy.ops.render.render(write_still=True)
