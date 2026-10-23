import math
import os
import random
import sys

import bpy
from mathutils import Vector


ROOT = os.path.dirname(os.path.abspath(__file__))
TAU = math.tau
OBJECT_X = 2.25
OBJECT_Y = 0.0
OBJECT_Z = 2.38


def command_mode():
    if "--" in sys.argv:
        arguments = sys.argv[sys.argv.index("--") + 1 :]
        if arguments:
            return arguments[0]
    return "still"


def set_input(node, name, value):
    socket = node.inputs.get(name)
    if socket is not None:
        socket.default_value = value


MODE = command_mode()
IS_ANIMATION = MODE == "anim"

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.render.resolution_x = 1440
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.film_transparent = False
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGB"
scene.render.image_settings.color_depth = "8"
scene.render.use_persistent_data = True
scene.render.fps = 24

scene.cycles.samples = 40 if IS_ANIMATION else 108
scene.cycles.use_adaptive_sampling = True
scene.cycles.adaptive_threshold = 0.032 if IS_ANIMATION else 0.019
scene.cycles.use_denoising = True
scene.cycles.denoiser = "OPENIMAGEDENOISE"
scene.cycles.max_bounces = 14
scene.cycles.diffuse_bounces = 3
scene.cycles.glossy_bounces = 8
scene.cycles.transmission_bounces = 14
scene.cycles.transparent_max_bounces = 12
scene.cycles.volume_bounces = 1
scene.cycles.caustics_reflective = False
scene.cycles.caustics_refractive = False
scene.cycles.time_limit = 42 if IS_ANIMATION else 92

try:
    preferences = bpy.context.preferences.addons["cycles"].preferences
    preferences.compute_device_type = "METAL"
    preferences.get_devices()
    gpu_available = False
    for device in preferences.devices:
        device.use = device.type in {"METAL", "APPLE"}
        gpu_available |= device.use
    scene.cycles.device = "GPU" if gpu_available else "CPU"
except Exception:
    scene.cycles.device = "CPU"

scene.view_settings.view_transform = "Standard"
try:
    scene.view_settings.look = "None"
except Exception:
    pass
scene.view_settings.exposure = 0.0
scene.view_settings.gamma = 1.0

world = bpy.data.worlds.new("Pure white optical studio")
scene.world = world
world.use_nodes = True
world_nodes = world.node_tree.nodes
world_links = world.node_tree.links
world_nodes.clear()
world_output = world_nodes.new("ShaderNodeOutputWorld")
ambient_background = world_nodes.new("ShaderNodeBackground")
ambient_background.name = "White studio ambience"
set_input(ambient_background, "Color", (0.92, 0.94, 1.0, 1.0))
set_input(ambient_background, "Strength", 0.72)
camera_background = world_nodes.new("ShaderNodeBackground")
camera_background.name = "Exact white camera field"
set_input(camera_background, "Color", (1.0, 1.0, 1.0, 1.0))
set_input(camera_background, "Strength", 1.0)
light_path = world_nodes.new("ShaderNodeLightPath")
world_mix = world_nodes.new("ShaderNodeMixShader")
world_links.new(light_path.outputs["Is Camera Ray"], world_mix.inputs[0])
world_links.new(ambient_background.outputs[0], world_mix.inputs[1])
world_links.new(camera_background.outputs[0], world_mix.inputs[2])
world_links.new(world_mix.outputs[0], world_output.inputs["Surface"])


def principled_material(name, color, roughness, metallic=0.0):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    set_input(shader, "Base Color", (*color, 1.0))
    set_input(shader, "Roughness", roughness)
    set_input(shader, "Metallic", metallic)
    return material


floor_material = bpy.data.materials.new("Glossy white seamless floor")
floor_material.use_nodes = True
floor_nodes = floor_material.node_tree.nodes
floor_links = floor_material.node_tree.links
floor_nodes.clear()
floor_output = floor_nodes.new("ShaderNodeOutputMaterial")
floor_shader = floor_nodes.new("ShaderNodeBsdfPrincipled")
set_input(floor_shader, "Base Color", (0.975, 0.98, 1.0, 1.0))
set_input(floor_shader, "Roughness", 0.20)
set_input(floor_shader, "Specular IOR Level", 0.38)
set_input(floor_shader, "Coat Weight", 0.26)
set_input(floor_shader, "Coat Roughness", 0.08)
floor_far_white = floor_nodes.new("ShaderNodeEmission")
set_input(floor_far_white, "Color", (1.0, 1.0, 1.0, 1.0))
set_input(floor_far_white, "Strength", 1.0)
floor_camera_data = floor_nodes.new("ShaderNodeCameraData")
floor_distance_fade = floor_nodes.new("ShaderNodeMapRange")
set_input(floor_distance_fade, "From Min", 18.0)
set_input(floor_distance_fade, "From Max", 52.0)
set_input(floor_distance_fade, "To Min", 0.0)
set_input(floor_distance_fade, "To Max", 1.0)
floor_distance_fade.clamp = True
floor_mix = floor_nodes.new("ShaderNodeMixShader")
floor_links.new(floor_camera_data.outputs["View Distance"], floor_distance_fade.inputs["Value"])
floor_links.new(floor_shader.outputs[0], floor_mix.inputs[1])
floor_links.new(floor_far_white.outputs[0], floor_mix.inputs[2])
floor_links.new(floor_distance_fade.outputs[0], floor_mix.inputs[0])
floor_links.new(floor_mix.outputs[0], floor_output.inputs["Surface"])

chrome_material = principled_material("Polished chrome", (0.76, 0.79, 0.86), 0.055, 1.0)
chrome_shader = chrome_material.node_tree.nodes.get("Principled BSDF")
set_input(chrome_shader, "Coat Weight", 0.34)
set_input(chrome_shader, "Coat Roughness", 0.018)
set_input(chrome_shader, "Anisotropic", 0.12)

glass_material = principled_material("Pale violet optical crystal", (0.88, 0.88, 1.0), 0.022)
glass_shader = glass_material.node_tree.nodes.get("Principled BSDF")
set_input(glass_shader, "Transmission Weight", 1.0)
set_input(glass_shader, "IOR", 1.52)
set_input(glass_shader, "Coat Weight", 0.18)
set_input(glass_shader, "Coat Roughness", 0.012)
set_input(glass_shader, "Emission Color", (0.63, 0.56, 1.0, 1.0))
set_input(glass_shader, "Emission Strength", 0.0025)
glass_nodes = glass_material.node_tree.nodes
glass_links = glass_material.node_tree.links
glass_output = glass_nodes.get("Material Output")
absorption = glass_nodes.new("ShaderNodeVolumeAbsorption")
set_input(absorption, "Color", (0.84, 0.80, 1.0, 1.0))
set_input(absorption, "Density", 0.018)
glass_links.new(absorption.outputs[0], glass_output.inputs["Volume"])

edge_material = principled_material("Crystal edge glints", (0.98, 0.98, 1.0), 0.055, 0.14)
edge_shader = edge_material.node_tree.nodes.get("Principled BSDF")
set_input(edge_shader, "Transmission Weight", 0.18)
set_input(edge_shader, "IOR", 1.48)
set_input(edge_shader, "Coat Weight", 0.52)
set_input(edge_shader, "Coat Roughness", 0.018)
set_input(edge_shader, "Emission Color", (0.88, 0.86, 1.0, 1.0))
set_input(edge_shader, "Emission Strength", 0.075)

hotspot_material = bpy.data.materials.new("Prism focal glow")
hotspot_material.use_nodes = True
hotspot_nodes = hotspot_material.node_tree.nodes
hotspot_links = hotspot_material.node_tree.links
hotspot_nodes.clear()
hotspot_output = hotspot_nodes.new("ShaderNodeOutputMaterial")
hotspot_emission = hotspot_nodes.new("ShaderNodeEmission")
set_input(hotspot_emission, "Color", (0.88, 0.84, 1.0, 1.0))
set_input(hotspot_emission, "Strength", 5.5)
hotspot_links.new(hotspot_emission.outputs[0], hotspot_output.inputs["Surface"])

bpy.ops.mesh.primitive_plane_add(size=180.0, location=(0.0, 0.0, 0.0))
floor = bpy.context.object
floor.name = "Infinite glossy white floor"
floor.data.materials.append(floor_material)


def add_bevel(obj, width, segments=3):
    bevel = obj.modifiers.new("Precision edge bevel", "BEVEL")
    bevel.width = width
    bevel.segments = segments
    bevel.limit_method = "ANGLE"
    bevel.angle_limit = math.radians(26.0)


def add_cylinder(name, radius, depth, z, material, bevel_width):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=192,
        radius=radius,
        depth=depth,
        end_fill_type="NGON",
        location=(OBJECT_X, OBJECT_Y, z),
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    add_bevel(obj, bevel_width, 5)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    return obj


base = add_cylinder("Chrome pedestal base", 1.56, 0.095, 0.0475, chrome_material, 0.026)
base_step = add_cylinder("Chrome pedestal inset step", 1.22, 0.062, 0.127, chrome_material, 0.018)

for ring_index, ring_y in enumerate((-0.085, 0.085), start=1):
    bpy.ops.mesh.primitive_torus_add(
        align="WORLD",
        major_segments=256,
        minor_segments=24,
        location=(OBJECT_X, ring_y, OBJECT_Z),
        rotation=(math.radians(90.0), 0.0, 0.0),
        major_radius=2.20,
        minor_radius=0.035,
    )
    ring = bpy.context.object
    ring.name = f"Chrome halo ring {ring_index}"
    ring.data.materials.append(chrome_material)
    for polygon in ring.data.polygons:
        polygon.use_smooth = True

crystal_vertices = [(0.02, -0.015, -1.72)]
ring_count = 8
for ring_index in range(ring_count):
    angle = TAU * ring_index / ring_count
    radius = 1.03 + 0.045 * math.sin(3.0 * angle)
    crystal_vertices.append((radius * math.cos(angle), 0.72 * math.sin(angle), -0.02 + 0.055 * math.sin(angle + 0.4)))
for ring_index in range(ring_count):
    angle = TAU * (ring_index + 0.22) / ring_count
    radius = 0.96 + 0.04 * math.cos(2.0 * angle)
    crystal_vertices.append((radius * math.cos(angle), 0.68 * math.sin(angle), 0.06 + 0.04 * math.cos(angle)))
crystal_vertices.append((-0.03, 0.018, 1.72))
top_index = len(crystal_vertices) - 1
crystal_faces = []
for ring_index in range(ring_count):
    lower = 1 + ring_index
    lower_next = 1 + (ring_index + 1) % ring_count
    upper = 1 + ring_count + ring_index
    upper_next = 1 + ring_count + (ring_index + 1) % ring_count
    crystal_faces.append((0, lower_next, lower))
    crystal_faces.append((lower, lower_next, upper_next, upper))
    crystal_faces.append((top_index, upper, upper_next))
crystal_mesh = bpy.data.meshes.new("Faceted optical crystal")
crystal_mesh.from_pydata(crystal_vertices, [], crystal_faces)
crystal_mesh.update()
crystal_mesh.validate()
crystal = bpy.data.objects.new("Floating faceted crystal", crystal_mesh)
bpy.context.collection.objects.link(crystal)
crystal.location = (OBJECT_X, OBJECT_Y, OBJECT_Z)
crystal.rotation_euler = (math.radians(-2.5), math.radians(4.0), math.radians(20.0))
crystal.data.materials.append(glass_material)
add_bevel(crystal, 0.012, 2)


def create_poly_curve(name, points, bevel_depth, material, parent=None, resolution=2):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = resolution
    curve.render_resolution_u = resolution
    curve.bevel_depth = bevel_depth
    curve.bevel_resolution = 2
    curve.use_fill_caps = True
    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for point, coordinate in zip(spline.points, points):
        point.co = (*coordinate, 1.0)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    obj.visible_shadow = False
    if parent is not None:
        obj.parent = parent
    return obj


crystal_edges = [
    (0, index) for index in range(1, 1 + ring_count)
] + [
    (1 + ring_index, 1 + (ring_index + 1) % ring_count)
    for ring_index in range(ring_count)
] + [
    (1 + ring_index, 1 + ring_count + ring_index)
    for ring_index in range(ring_count)
] + [
    (1 + ring_count + ring_index, 1 + ring_count + (ring_index + 1) % ring_count)
    for ring_index in range(ring_count)
] + [
    (top_index, 1 + ring_count + ring_index)
    for ring_index in range(ring_count)
]
for edge_index, (start_index, end_index) in enumerate(crystal_edges):
    create_poly_curve(
        f"Crystal bright edge {edge_index + 1:02d}",
        [crystal_vertices[start_index], crystal_vertices[end_index]],
        0.0085,
        edge_material,
        crystal,
    )

bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=0.048, location=(OBJECT_X, OBJECT_Y, OBJECT_Z))
hotspot = bpy.context.object
hotspot.name = "Optical focal flare"
hotspot.data.materials.append(hotspot_material)
hotspot.visible_shadow = False


def make_ray_material(name, color_start, color_middle, color_end, strength, end_visibility):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    mix_shader = nodes.new("ShaderNodeMixShader")
    transparent = nodes.new("ShaderNodeBsdfTransparent")
    emission = nodes.new("ShaderNodeEmission")
    texture_coordinate = nodes.new("ShaderNodeTexCoord")
    separate = nodes.new("ShaderNodeSeparateXYZ")
    links.new(texture_coordinate.outputs["Generated"], separate.inputs["Vector"])

    color_ramp = nodes.new("ShaderNodeValToRGB")
    color_ramp.color_ramp.interpolation = "EASE"
    color_ramp.color_ramp.elements[0].position = 0.0
    color_ramp.color_ramp.elements[0].color = (*color_start, 1.0)
    color_ramp.color_ramp.elements[1].position = 1.0
    color_ramp.color_ramp.elements[1].color = (*color_end, 1.0)
    middle = color_ramp.color_ramp.elements.new(0.36)
    middle.color = (*color_middle, 1.0)
    links.new(separate.outputs["X"], color_ramp.inputs["Fac"])
    links.new(color_ramp.outputs["Color"], emission.inputs["Color"])

    fade_map = nodes.new("ShaderNodeMapRange")
    set_input(fade_map, "From Min", 0.0)
    set_input(fade_map, "From Max", 1.0)
    set_input(fade_map, "To Min", 1.0)
    set_input(fade_map, "To Max", end_visibility)
    fade_map.clamp = True
    links.new(separate.outputs["X"], fade_map.inputs["Value"])

    phase_value = nodes.new("ShaderNodeValue")
    phase_value.name = "Loop phase"
    phase_value.outputs[0].driver_add("default_value").driver.expression = "fmod(frame - 1.0, 72.0) / 72.0"
    object_info = nodes.new("ShaderNodeObjectInfo")
    phase_random = nodes.new("ShaderNodeMath")
    phase_random.operation = "MULTIPLY"
    phase_random.inputs[1].default_value = TAU
    links.new(object_info.outputs["Random"], phase_random.inputs[0])
    phase_cycle = nodes.new("ShaderNodeMath")
    phase_cycle.operation = "MULTIPLY"
    phase_cycle.inputs[1].default_value = TAU
    links.new(phase_value.outputs[0], phase_cycle.inputs[0])
    phase_position = nodes.new("ShaderNodeMath")
    phase_position.operation = "MULTIPLY"
    phase_position.inputs[1].default_value = TAU * 2.8
    links.new(separate.outputs["X"], phase_position.inputs[0])
    phase_sum_a = nodes.new("ShaderNodeMath")
    phase_sum_a.operation = "ADD"
    links.new(phase_cycle.outputs[0], phase_sum_a.inputs[0])
    links.new(phase_random.outputs[0], phase_sum_a.inputs[1])
    phase_sum_b = nodes.new("ShaderNodeMath")
    phase_sum_b.operation = "ADD"
    links.new(phase_sum_a.outputs[0], phase_sum_b.inputs[0])
    links.new(phase_position.outputs[0], phase_sum_b.inputs[1])
    wave = nodes.new("ShaderNodeMath")
    wave.operation = "SINE"
    links.new(phase_sum_b.outputs[0], wave.inputs[0])
    pulse_map = nodes.new("ShaderNodeMapRange")
    set_input(pulse_map, "From Min", -1.0)
    set_input(pulse_map, "From Max", 1.0)
    set_input(pulse_map, "To Min", 0.88)
    set_input(pulse_map, "To Max", 1.12)
    links.new(wave.outputs[0], pulse_map.inputs["Value"])
    strength_pulse = nodes.new("ShaderNodeMath")
    strength_pulse.operation = "MULTIPLY"
    strength_pulse.inputs[1].default_value = strength
    links.new(pulse_map.outputs[0], strength_pulse.inputs[0])
    breath_value = nodes.new("ShaderNodeValue")
    breath_value.name = "Loop intensity breath"
    breath_value.outputs[0].driver_add("default_value").driver.expression = "0.95 + 0.05 * cos(6.283185307179586 * (frame - 1.0) / 72.0)"
    strength_breath = nodes.new("ShaderNodeMath")
    strength_breath.operation = "MULTIPLY"
    links.new(strength_pulse.outputs[0], strength_breath.inputs[0])
    links.new(breath_value.outputs[0], strength_breath.inputs[1])
    links.new(strength_breath.outputs[0], emission.inputs["Strength"])
    links.new(transparent.outputs[0], mix_shader.inputs[1])
    links.new(emission.outputs[0], mix_shader.inputs[2])
    links.new(fade_map.outputs[0], mix_shader.inputs[0])
    links.new(mix_shader.outputs[0], output.inputs["Surface"])
    return material


incoming_material = make_ray_material(
    "Incoming white beam",
    (0.92, 0.95, 1.0),
    (1.0, 1.0, 1.0),
    (0.98, 0.98, 1.0),
    7.2,
    0.48,
)
incoming_glow_material = make_ray_material(
    "Incoming beam soft bloom",
    (0.92, 0.95, 1.0),
    (0.98, 0.98, 1.0),
    (0.96, 0.97, 1.0),
    0.30,
    0.18,
)
ray_materials = [
    make_ray_material("Diverging violet rays bright", (1.0, 0.985, 1.0), (0.51, 0.31, 1.0), (0.48, 0.24, 1.0), 4.8, 0.0),
    make_ray_material("Diverging violet rays core", (0.98, 0.95, 1.0), (0.38, 0.18, 1.0), (0.38, 0.16, 1.0), 4.0, 0.0),
    make_ray_material("Diverging violet rays pale", (1.0, 0.98, 1.0), (0.62, 0.43, 1.0), (0.54, 0.32, 1.0), 3.4, 0.0),
]
ray_glow_materials = [
    make_ray_material("Soft violet bloom bright", (1.0, 0.98, 1.0), (0.58, 0.36, 1.0), (0.50, 0.28, 1.0), 0.34, 0.0),
    make_ray_material("Soft violet bloom core", (0.98, 0.94, 1.0), (0.43, 0.22, 1.0), (0.40, 0.19, 1.0), 0.28, 0.0),
    make_ray_material("Soft violet bloom pale", (1.0, 0.98, 1.0), (0.68, 0.50, 1.0), (0.58, 0.37, 1.0), 0.23, 0.0),
]

incoming_points = [
    (-18.2, -0.30, -1.32),
    (-12.6, -0.24, -0.99),
    (-7.0, -0.15, -0.61),
    (-2.2, -0.06, -0.22),
    (0.12, -0.012, 0.0),
]
create_poly_curve("Thin incoming white beam", incoming_points, 0.012, incoming_material, resolution=7)
create_poly_curve("Incoming beam halo", incoming_points, 0.036, incoming_glow_material, resolution=7)

fan_parent = bpy.data.objects.new("Ray fan pivot", None)
bpy.context.collection.objects.link(fan_parent)
fan_parent.location = (OBJECT_X + 0.12, OBJECT_Y, OBJECT_Z)

randomizer = random.Random(20261023)
ray_count = 38
for index in range(ray_count):
    normalized = index / (ray_count - 1)
    vertical = (normalized - 0.5) * 4.65 + randomizer.uniform(-0.08, 0.08)
    depth = randomizer.uniform(-0.36, 0.36)
    curve_amount = randomizer.uniform(-0.16, 0.16)
    points = []
    for step in range(11):
        amount = step / 10.0
        x = 15.8 * amount
        z = vertical * amount + curve_amount * math.sin(math.pi * amount)
        y = depth * amount + 0.04 * math.sin(index * 0.71 + math.pi * amount)
        points.append((x, y, z))
    thickness = randomizer.uniform(0.006, 0.018)
    variant = index % len(ray_materials)
    ray = create_poly_curve(f"Ray filament {index + 1:02d}", points, thickness, ray_materials[variant], fan_parent, 5)
    ray.rotation_euler[1] = randomizer.uniform(-0.0025, 0.0025)
    glow = create_poly_curve(
        f"Ray soft bloom {index + 1:02d}",
        points,
        thickness * randomizer.uniform(2.7, 3.8),
        ray_glow_materials[variant],
        fan_parent,
        4,
    )
    glow.rotation_euler[1] = ray.rotation_euler[1]

if IS_ANIMATION:
    fan_driver = fan_parent.driver_add("rotation_euler", 1).driver
    fan_driver.type = "SCRIPTED"
    fan_driver.expression = "0.02094395102 * sin(6.28318530718 * (frame - 1.0) / 72.0)"
    crystal_driver = crystal.driver_add("rotation_euler", 2).driver
    crystal_driver.type = "SCRIPTED"
    crystal_driver.expression = "0.3490658504 + 0.0436332313 * sin(6.28318530718 * (frame - 1.0) / 72.0)"


def add_area_light(name, location, target, energy, size_x, size_y, color):
    light_data = bpy.data.lights.new(name, "AREA")
    light_data.energy = energy
    light_data.color = color
    light_data.shape = "RECTANGLE"
    light_data.size = size_x
    light_data.size_y = size_y
    light = bpy.data.objects.new(name, light_data)
    bpy.context.collection.objects.link(light)
    light.location = location
    light.rotation_euler = (Vector(target) - Vector(location)).to_track_quat("-Z", "Y").to_euler()
    return light


add_area_light("Large overhead softbox", (-3.5, -5.5, 11.5), (OBJECT_X, 0.0, 2.0), 820.0, 10.0, 7.0, (1.0, 0.99, 0.97))
add_area_light("Cool left reflection strip", (-8.5, -4.0, 5.2), (OBJECT_X, 0.0, 2.4), 520.0, 5.5, 2.8, (0.88, 0.93, 1.0))
add_area_light("Violet right rim strip", (9.5, 1.8, 6.8), (OBJECT_X, 0.0, 2.2), 520.0, 5.5, 3.2, (0.72, 0.62, 1.0))
add_area_light("Low floor fill", (0.5, -8.0, 2.3), (OBJECT_X, 0.0, 0.35), 220.0, 7.0, 3.5, (0.88, 0.91, 1.0))

focus_light_data = bpy.data.lights.new("Crystal internal glow", "POINT")
focus_light_data.energy = 58.0
focus_light_data.color = (0.64, 0.54, 1.0)
focus_light_data.shadow_soft_size = 1.1
focus_light = bpy.data.objects.new("Crystal internal glow", focus_light_data)
bpy.context.collection.objects.link(focus_light)
focus_light.location = (OBJECT_X, OBJECT_Y, OBJECT_Z)

camera_data = bpy.data.cameras.new("Hero camera")
camera = bpy.data.objects.new("Hero camera", camera_data)
bpy.context.collection.objects.link(camera)
camera.location = (-1.45, -23.2, 4.35)
camera_target = Vector((1.22, 0.0, 2.28))
camera.rotation_euler = (camera_target - camera.location).to_track_quat("-Z", "Y").to_euler()
camera_data.type = "PERSP"
camera_data.lens = 70.0
camera_data.sensor_width = 36.0
camera_data.dof.use_dof = True
camera_data.dof.focus_object = crystal
camera_data.dof.aperture_fstop = 8.0
scene.camera = camera

try:
    scene.use_nodes = True
    compositor_nodes = scene.node_tree.nodes
    compositor_links = scene.node_tree.links
    compositor_nodes.clear()
    render_layers = compositor_nodes.new("CompositorNodeRLayers")
    render_layers.location = (-320, 0)
    glare = compositor_nodes.new("CompositorNodeGlare")
    glare.location = (0, 0)
    glare.glare_type = "FOG_GLOW"
    if hasattr(glare, "quality"):
        glare.quality = "HIGH"
    if hasattr(glare, "threshold"):
        glare.threshold = 0.34
    if hasattr(glare, "size"):
        glare.size = 5
    if hasattr(glare, "mix"):
        glare.mix = -0.55
    composite = compositor_nodes.new("CompositorNodeComposite")
    composite.location = (300, 0)
    compositor_links.new(render_layers.outputs["Image"], glare.inputs["Image"])
    compositor_links.new(glare.outputs["Image"], composite.inputs["Image"])
except Exception:
    pass

if IS_ANIMATION:
    scene.frame_start = 1
    scene.frame_end = 72
    scene.render.filepath = os.path.join(ROOT, "frames", "f_")
    os.makedirs(os.path.join(ROOT, "frames"), exist_ok=True)
    bpy.ops.render.render(animation=True)
else:
    scene.frame_set(1)
    scene.render.filepath = os.path.join(ROOT, "out.png")
    bpy.ops.render.render(write_still=True)

print("HERO_RENDER_COMPLETE", MODE, scene.cycles.device)
