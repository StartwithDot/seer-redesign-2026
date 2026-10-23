import math
import os
import sys

import bpy
from mathutils import Vector


OUTPUT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out.png")


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

    for datablocks in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def set_input(node, names, value):
    for name in names:
        socket = node.inputs.get(name)
        if socket is not None:
            socket.default_value = value
            return


def make_principled_material(name, base_color, roughness, metallic=0.0, coat=0.0):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    set_input(shader, ("Base Color",), base_color)
    set_input(shader, ("Roughness",), roughness)
    set_input(shader, ("Metallic",), metallic)
    set_input(shader, ("Coat Weight", "Clearcoat"), coat)
    set_input(shader, ("Coat Roughness", "Clearcoat Roughness"), 0.08)
    return material


def make_violet_glass_material():
    material = bpy.data.materials.new("Deep Violet Glass")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputMaterial")
    output.location = (650, 40)
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    shader.location = (300, 110)
    set_input(shader, ("Base Color",), (0.150, 0.035, 0.95, 1.0))
    set_input(shader, ("Roughness",), 0.055)
    set_input(shader, ("IOR",), 1.47)
    set_input(shader, ("Transmission Weight", "Transmission"), 0.82)
    set_input(shader, ("Coat Weight", "Clearcoat"), 0.28)
    set_input(shader, ("Coat Roughness", "Clearcoat Roughness"), 0.055)
    set_input(shader, ("Emission Color",), (0.19, 0.07, 1.0, 1.0))
    set_input(shader, ("Emission Strength",), 0.065)

    absorption = nodes.new("ShaderNodeVolumeAbsorption")
    absorption.location = (305, -115)
    absorption.inputs["Color"].default_value = (0.25, 0.055, 0.85, 1.0)
    absorption.inputs["Density"].default_value = 2.6

    links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    links.new(absorption.outputs["Volume"], output.inputs["Volume"])
    return material


def make_beam_material():
    material = bpy.data.materials.new("Atmospheric Light Beam")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputMaterial")
    output.location = (520, 20)
    transparent = nodes.new("ShaderNodeBsdfTransparent")
    transparent.location = (285, 115)
    scatter = nodes.new("ShaderNodeVolumeScatter")
    scatter.location = (285, -80)
    scatter.inputs["Color"].default_value = (0.80, 0.76, 1.0, 1.0)
    scatter.inputs["Density"].default_value = 0.11
    scatter.inputs["Anisotropy"].default_value = 0.8

    links.new(transparent.outputs["BSDF"], output.inputs["Surface"])
    glow = nodes.new("ShaderNodeVolumePrincipled")
    glow.inputs["Density"].default_value = 0.0
    glow.inputs["Emission Color"].default_value = (0.72, 0.62, 1.0, 1.0)
    glow.inputs["Emission Strength"].default_value = 0.24
    add = nodes.new("ShaderNodeAddShader")
    links.new(scatter.outputs["Volume"], add.inputs[0])
    links.new(glow.outputs["Volume"], add.inputs[1])
    links.new(add.outputs[0], output.inputs["Volume"])
    return material


def add_beveled_box(name, location, dimensions, material, bevel_width=0.08, bevel_segments=5):
    bpy.ops.mesh.primitive_cube_add(location=location)
    box = bpy.context.object
    box.name = name
    box.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    bevel = box.modifiers.new("Precision edge bevel", "BEVEL")
    bevel.width = bevel_width
    bevel.segments = bevel_segments
    bevel.limit_method = "ANGLE"
    if hasattr(bevel, "harden_normals"):
        bevel.harden_normals = True
    box.data.materials.append(material)
    for polygon in box.data.polygons:
        polygon.use_smooth = True
    normal = box.modifiers.new("Weighted planar normals", "WEIGHTED_NORMAL")
    normal.keep_sharp = True
    return box


def add_arch_frame(material):
    curve_data = bpy.data.curves.new("Chrome Arch Frame", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.resolution_u = 16
    curve_data.bevel_depth = 0.038
    curve_data.bevel_resolution = 6
    curve_data.resolution_u = 18

    spline = curve_data.splines.new("POLY")
    arch_center_x = 3.23
    arch_center_z = 4.24
    arch_radius = 0.73
    frame_y = 1.15

    points = [(arch_center_x - arch_radius, frame_y, 3.28)]
    points.append((arch_center_x - arch_radius, frame_y, arch_center_z))
    for index in range(1, 129):
        angle = math.pi - (math.pi * index / 128.0)
        points.append(
            (
                arch_center_x + arch_radius * math.cos(angle),
                frame_y,
                arch_center_z + arch_radius * math.sin(angle),
            )
        )
    points.append((arch_center_x + arch_radius, frame_y, 3.28))

    spline.points.add(len(points) - 1)
    for point, coordinate in zip(spline.points, points):
        point.co = (*coordinate, 1.0)

    arch = bpy.data.objects.new("Thin Chrome Opportunity Arch", curve_data)
    bpy.context.collection.objects.link(arch)
    curve_data.materials.append(material)
    return arch


def add_light_beam():
    source = Vector((-4.55, -3.05, 8.75))
    target = Vector((3.22, -0.18, 3.48))
    direction = target - source
    midpoint = (source + target) * 0.5

    bpy.ops.mesh.primitive_cone_add(
        vertices=64,
        radius1=0.034,
        radius2=0.165,
        depth=direction.length,
        end_fill_type="NGON",
        location=midpoint,
    )
    beam = bpy.context.object
    beam.name = "Thin Violet White Light Beam"
    beam.rotation_mode = "QUATERNION"
    beam.rotation_quaternion = direction.to_track_quat("Z", "Y")
    beam.data.materials.append(make_beam_material())
    beam.visible_shadow = False
    beam.visible_diffuse = False
    beam.visible_glossy = False

    bpy.ops.object.light_add(type="SPOT", location=source)
    spot = bpy.context.object
    spot.name = "Beam Spot Source"
    spot.data.energy = 1280.0
    spot.data.color = (0.82, 0.78, 1.0)
    spot.data.spot_size = math.radians(5.2)
    spot.data.spot_blend = 0.82
    spot.data.shadow_soft_size = 0.38
    spot.rotation_mode = "QUATERNION"
    spot.rotation_quaternion = direction.to_track_quat("-Z", "Y")


def add_area_light(name, location, energy, size, color, target):
    bpy.ops.object.light_add(type="AREA", location=location)
    light = bpy.context.object
    light.name = name
    light.data.energy = energy
    light.data.shape = "DISK"
    light.data.size = size
    light.data.color = color
    direction = Vector(target) - Vector(location)
    light.rotation_mode = "QUATERNION"
    light.rotation_quaternion = direction.to_track_quat("-Z", "Y")
    return light


def add_camera():
    bpy.ops.object.camera_add(location=(11.55, -18.15, 8.95))
    camera = bpy.context.object
    camera.name = "Architectural Product Camera"
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 12.7
    camera.data.sensor_width = 36.0
    camera.data.dof.use_dof = False
    camera.data.dof.focus_object = bpy.data.objects["Violet Opportunity Plate"]
    camera.data.dof.aperture_fstop = 8.0

    target = Vector((0.10, 0.12, 2.05))
    direction = target - camera.location
    camera.rotation_mode = "QUATERNION"
    camera.rotation_quaternion = direction.to_track_quat("-Z", "Y")
    bpy.context.scene.camera = camera


def configure_render():
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.render.resolution_x = 1600
    scene.render.resolution_y = 1200
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.filepath = OUTPUT_PATH
    scene.render.film_transparent = False
    scene.render.use_file_extension = True

    scene.cycles.samples = 96
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.012
    scene.cycles.use_denoising = True
    scene.cycles.denoiser = "OPENIMAGEDENOISE"
    scene.cycles.denoising_input_passes = "RGB_ALBEDO_NORMAL"
    scene.cycles.denoising_prefilter = "ACCURATE"
    scene.cycles.max_bounces = 8
    scene.cycles.diffuse_bounces = 4
    scene.cycles.glossy_bounces = 5
    scene.cycles.transmission_bounces = 8
    scene.cycles.transparent_max_bounces = 8
    scene.cycles.volume_bounces = 1
    scene.cycles.volume_step_rate = 1.25
    scene.cycles.volume_max_steps = 56
    scene.cycles.use_fast_gi = False

    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0.35
    scene.view_settings.gamma = 1.0
    scene.cycles.time_limit = 72.0

    scene.render.use_overwrite = True
    scene.render.use_placeholder = False

    preferences = bpy.context.preferences.addons.get("cycles")
    if preferences is not None:
        cycles_preferences = preferences.preferences
        try:
            cycles_preferences.get_devices()
            cycles_preferences.compute_device_type = "METAL"
            cycles_preferences.get_devices()
            metal_devices = [device for device in cycles_preferences.devices if device.type == "METAL"]
            for device in cycles_preferences.devices:
                device.use = device in metal_devices
            scene.cycles.device = "GPU" if metal_devices else "CPU"
        except Exception as error:
            print(f"GPU Metal setup unavailable; using CPU fallback: {error}", file=sys.stderr)
            scene.cycles.device = "CPU"
    else:
        scene.cycles.device = "CPU"


def build_scene():
    clear_scene()

    ceramic = make_principled_material(
        "Matte White Ceramic",
        (0.955, 0.955, 0.965, 1.0),
        0.28,
        metallic=0.0,
        coat=0.10,
    )
    ceramic_edge = make_principled_material(
        "Matte White Ceramic Edge",
        (0.955, 0.955, 0.965, 1.0),
        0.28,
        metallic=0.0,
        coat=0.13,
    )
    chrome = make_principled_material(
        "Polished Chrome",
        (0.82, 0.84, 0.90, 1.0),
        0.085,
        metallic=1.0,
        coat=0.15,
    )
    violet_glass = make_violet_glass_material()
    floor_material = make_principled_material(
        "Glossy White Seamless Studio",
        (0.985, 0.985, 0.992, 1.0),
        0.17,
        metallic=0.0,
        coat=0.12,
    )

    bpy.ops.mesh.primitive_plane_add(size=200.0, location=(0.0, 2.0, -0.012))
    floor = bpy.context.object
    floor.name = "Glossy White Seamless Floor"
    floor.data.materials.append(floor_material)
    floor_shader = floor_material.node_tree.nodes.get("Principled BSDF")
    set_input(floor_shader, ("Emission Color",), (1.0, 1.0, 1.0, 1.0))
    set_input(floor_shader, ("Emission Strength",), 0.65)

    step_top_heights = (0.72, 1.34, 1.98, 2.66)
    step_width = 1.58
    step_depth = 2.38
    step_centers = (-3.22, -1.61, 0.0, 1.61, 3.22)

    for index, (center_x, top_height) in enumerate(zip(step_centers[:4], step_top_heights), start=1):
        add_beveled_box(
            f"Matte Ceramic Opportunity Plate {index}",
            (center_x, 0.12, top_height * 0.5),
            (step_width, step_depth, top_height),
            ceramic if index % 2 else ceramic_edge,
            bevel_width=0.065,
            bevel_segments=5,
        )

    fifth_riser_height = 2.86
    add_beveled_box(
        "Matte Ceramic Opportunity Plate 5",
        (step_centers[4], 0.12, fifth_riser_height * 0.5),
        (step_width, step_depth, fifth_riser_height),
        ceramic_edge,
        bevel_width=0.065,
        bevel_segments=5,
    )
    add_beveled_box(
        "Violet Opportunity Plate",
        (step_centers[4], 0.12, fifth_riser_height + 0.22),
        (step_width + 0.035, step_depth + 0.035, 0.44),
        violet_glass,
        bevel_width=0.065,
        bevel_segments=7,
    )

    add_arch_frame(chrome)
    add_light_beam()

    add_area_light(
        "Large Soft Key",
        (-6.3, -7.6, 12.2),
        2700.0,
        7.0,
        (1.0, 0.95, 0.93),
        (0.0, 0.1, 1.3),
    )
    add_area_light(
        "Cool Studio Fill",
        (8.4, -4.2, 9.2),
        700.0,
        6.0,
        (0.84, 0.88, 1.0),
        (1.3, 0.1, 1.6),
    )
    add_area_light(
        "Soft Violet Rim Strip",
        (3.1, 8.2, 10.8),
        1000.0,
        6.5,
        (1.0, 0.80, 0.95),
        (2.4, 0.2, 2.1),
    )
    add_area_light(
        "Front Reflection Card",
        (-1.8, -10.0, 5.2),
        320.0,
        5.5,
        (1.0, 1.0, 1.0),
        (0.0, 0.0, 1.2),
    )

    world = bpy.context.scene.world
    world.use_nodes = True
    world_nodes = world.node_tree.nodes
    world_links = world.node_tree.links
    world_nodes.clear()
    world_output = world_nodes.new("ShaderNodeOutputWorld")
    ambient = world_nodes.new("ShaderNodeBackground")
    ambient.inputs["Color"].default_value = (1.0, 1.0, 1.0, 1.0)
    ambient.inputs["Strength"].default_value = 0.18
    camera_white = world_nodes.new("ShaderNodeBackground")
    camera_white.inputs["Color"].default_value = (1.0, 1.0, 1.0, 1.0)
    camera_white.inputs["Strength"].default_value = 1.0
    light_path = world_nodes.new("ShaderNodeLightPath")
    camera_mix = world_nodes.new("ShaderNodeMixShader")
    world_links.new(light_path.outputs["Is Camera Ray"], camera_mix.inputs[0])
    world_links.new(ambient.outputs["Background"], camera_mix.inputs[1])
    world_links.new(camera_white.outputs["Background"], camera_mix.inputs[2])
    world_links.new(camera_mix.outputs["Shader"], world_output.inputs["Surface"])

    add_camera()
    configure_render()


if __name__ == "__main__":
    build_scene()
    bpy.ops.render.render(write_still=True)
    print(f"Rendered {OUTPUT_PATH}")
