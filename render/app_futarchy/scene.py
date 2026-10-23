import math
import os

import bpy
import bmesh
from mathutils import Vector


OUTPUT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out.png")


def clean_scene():
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


def hex_rgba(value, alpha=1.0):
    value = value.lstrip("#")
    return tuple(((int(value[index : index + 2], 16) / 255.0 + 0.055) / 1.055) ** 2.4 for index in (0, 2, 4)) + (alpha,)


def principled_material(name, color, roughness=0.35, metallic=0.0, coat=0.0):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = color
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    if "Coat Weight" in shader.inputs:
        shader.inputs["Coat Weight"].default_value = coat
        shader.inputs["Coat Roughness"].default_value = 0.09
    return material


def ceramic_material():
    material = principled_material(
        "Matte White Ceramic",
        hex_rgba("#F2F2EF"),
        roughness=0.32,
        metallic=0.0,
        coat=0.12,
    )
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Specular IOR Level"].default_value = 0.38
    return material


def chrome_material():
    return principled_material(
        "Thin Polished Chrome",
        hex_rgba("#D8DCE6"),
        roughness=0.07,
        metallic=0.96,
        coat=0.28,
    )


def glass_material():
    material = bpy.data.materials.new("Deep Violet Optical Glass")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    for node in list(nodes):
        nodes.remove(node)

    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    absorption = nodes.new("ShaderNodeVolumeAbsorption")
    shader.inputs["Base Color"].default_value = hex_rgba("#6C47FF")
    shader.inputs["Roughness"].default_value = 0.055
    shader.inputs["IOR"].default_value = 1.47
    shader.inputs["Transmission Weight"].default_value = 1.0
    shader.inputs["Coat Weight"].default_value = 0.38
    shader.inputs["Coat Roughness"].default_value = 0.025
    absorption.inputs["Color"].default_value = hex_rgba("#6C47FF")
    absorption.inputs["Density"].default_value = 0.75
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    links.new(absorption.outputs["Volume"], output.inputs["Volume"])
    return material


def violet_core_material():
    material = bpy.data.materials.new("Violet Glass Interior")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    for node in list(nodes):
        nodes.remove(node)
    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    absorption = nodes.new("ShaderNodeVolumeAbsorption")
    shader.inputs["Base Color"].default_value = hex_rgba("#5632F4")
    shader.inputs["Roughness"].default_value = 0.105
    shader.inputs["IOR"].default_value = 1.46
    shader.inputs["Transmission Weight"].default_value = 0.68
    shader.inputs["Coat Weight"].default_value = 0.28
    shader.inputs["Coat Roughness"].default_value = 0.035
    absorption.inputs["Color"].default_value = hex_rgba("#6C47FF")
    absorption.inputs["Density"].default_value = 0.32
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    links.new(absorption.outputs["Volume"], output.inputs["Volume"])
    return material


def floor_material():
    material = principled_material("White lacquer seamless", (1, 1, 1, 1), roughness=0.19, coat=0.25)
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Emission Color"].default_value = (1, 1, 1, 1)
    shader.inputs["Emission Strength"].default_value = 0.10
    return material


def emission_material(name, color, strength):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    for node in list(nodes):
        nodes.remove(node)
    output = nodes.new("ShaderNodeOutputMaterial")
    emission = nodes.new("ShaderNodeEmission")
    emission.inputs["Color"].default_value = color
    emission.inputs["Strength"].default_value = strength
    links.new(emission.outputs["Emission"], output.inputs["Surface"])
    return material


def soft_beam_material(name, color, strength, end_fade=0.2):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    for node in list(nodes):
        nodes.remove(node)

    output = nodes.new("ShaderNodeOutputMaterial")
    mix = nodes.new("ShaderNodeMixShader")
    transparent = nodes.new("ShaderNodeBsdfTransparent")
    emission = nodes.new("ShaderNodeEmission")
    generated = nodes.new("ShaderNodeTexCoord")
    separate = nodes.new("ShaderNodeSeparateXYZ")

    subtract_x = nodes.new("ShaderNodeMath")
    subtract_x.operation = "SUBTRACT"
    subtract_x.inputs[0].default_value = 0.5
    subtract_y = nodes.new("ShaderNodeMath")
    subtract_y.operation = "SUBTRACT"
    subtract_y.inputs[0].default_value = 0.5
    square_x = nodes.new("ShaderNodeMath")
    square_x.operation = "MULTIPLY"
    square_y = nodes.new("ShaderNodeMath")
    square_y.operation = "MULTIPLY"
    add_squares = nodes.new("ShaderNodeMath")
    add_squares.operation = "ADD"
    radial_distance = nodes.new("ShaderNodeMath")
    radial_distance.operation = "POWER"
    radial_distance.inputs[1].default_value = 0.5
    radial_ramp = nodes.new("ShaderNodeValToRGB")
    radial_ramp.color_ramp.elements[0].position = 0.05
    radial_ramp.color_ramp.elements[0].color = (1, 1, 1, 1)
    radial_ramp.color_ramp.elements[1].position = 0.5
    radial_ramp.color_ramp.elements[1].color = (0, 0, 0, 1)

    length_ramp = nodes.new("ShaderNodeValToRGB")
    length_ramp.color_ramp.elements[0].position = 0.0
    length_ramp.color_ramp.elements[0].color = (end_fade, end_fade, end_fade, 1)
    length_ramp.color_ramp.elements[1].position = 1.0
    length_ramp.color_ramp.elements[1].color = (end_fade, end_fade, end_fade, 1)
    bright_start = length_ramp.color_ramp.elements.new(0.08)
    bright_start.color = ((1, 1, 1, 1) if "Core" in name else (0.10, 0.10, 0.10, 1))
    bright_end = length_ramp.color_ramp.elements.new(0.86)
    bright_end.color = ((1, 1, 1, 1) if "Core" in name else (0.10, 0.10, 0.10, 1))

    multiply = nodes.new("ShaderNodeMath")
    multiply.operation = "MULTIPLY"

    emission.inputs["Color"].default_value = color
    emission.inputs["Strength"].default_value = strength

    links.new(generated.outputs["Generated"], separate.inputs["Vector"])
    links.new(separate.outputs["X"], subtract_x.inputs[1])
    links.new(separate.outputs["Y"], subtract_y.inputs[1])
    links.new(subtract_x.outputs["Value"], square_x.inputs[0])
    links.new(subtract_x.outputs["Value"], square_x.inputs[1])
    links.new(subtract_y.outputs["Value"], square_y.inputs[0])
    links.new(subtract_y.outputs["Value"], square_y.inputs[1])
    links.new(square_x.outputs["Value"], add_squares.inputs[0])
    links.new(square_y.outputs["Value"], add_squares.inputs[1])
    links.new(add_squares.outputs["Value"], radial_distance.inputs[0])
    links.new(radial_distance.outputs["Value"], radial_ramp.inputs["Fac"])
    links.new(separate.outputs["Z"], length_ramp.inputs["Fac"])
    links.new(radial_ramp.outputs["Color"], multiply.inputs[0])
    links.new(length_ramp.outputs["Color"], multiply.inputs[1])
    links.new(length_ramp.outputs["Color"], mix.inputs["Fac"])
    links.new(transparent.outputs["BSDF"], mix.inputs[1])
    links.new(emission.outputs["Emission"], mix.inputs[2])
    links.new(mix.outputs["Shader"], output.inputs["Surface"])
    material.diffuse_color = color
    return material


def add_plane(name, size, location, material):
    bpy.ops.mesh.primitive_plane_add(size=size, location=location)
    plane = bpy.context.object
    plane.name = name
    plane.data.materials.append(material)
    return plane


def add_beveled_cube(name, location, scale, material, bevel=0.12, segments=5):
    bpy.ops.mesh.primitive_cube_add(location=location)
    cube = bpy.context.object
    cube.name = name
    cube.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    modifier = cube.modifiers.new("Precision bevel", "BEVEL")
    modifier.width = bevel
    modifier.segments = segments
    modifier.limit_method = "ANGLE"
    cube.data.materials.append(material)
    return cube


def add_cylinder_between(name, start, end, radius, material, vertices=32):
    start = Vector(start)
    end = Vector(end)
    direction = end - start
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=direction.length,
        location=(start + end) * 0.5,
    )
    cylinder = bpy.context.object
    cylinder.name = name
    cylinder.rotation_mode = "QUATERNION"
    cylinder.rotation_quaternion = direction.to_track_quat("Z", "Y")
    cylinder.data.materials.append(material)
    for polygon in cylinder.data.polygons:
        polygon.use_smooth = True
    return cylinder


def add_disc(name, location, radius, depth, material):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=64,
        radius=radius,
        depth=depth,
        location=location,
    )
    disc = bpy.context.object
    disc.name = name
    bevel = disc.modifiers.new("Polished edge", "BEVEL")
    bevel.width = min(depth * 0.22, radius * 0.08)
    bevel.segments = 3
    disc.data.materials.append(material)
    for polygon in disc.data.polygons:
        polygon.use_smooth = True
    return disc


def add_prism_profile(name, profile, half_depth, material, bevel_width, scale=(1, 1, 1)):
    vertices = [(x * scale[0], -half_depth * scale[1], z * scale[2]) for x, z in profile]
    vertices += [(x * scale[0], half_depth * scale[1], z * scale[2]) for x, z in profile]
    faces = [(0, 1, 2, 3, 4), (9, 8, 7, 6, 5)]
    for index in range(5):
        next_index = (index + 1) % 5
        faces.append((index, 5 + index, 5 + next_index, next_index))
    mesh = bpy.data.meshes.new(f"{name} Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.validate()
    mesh.update()
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(mesh)
    bm.free()
    object = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(object)
    object.data.materials.append(material)
    bevel = object.modifiers.new("Optical edge bevel", "BEVEL")
    bevel.width = bevel_width
    bevel.segments = 5
    bevel.limit_method = "ANGLE"
    bevel.harden_normals = True
    return object


def add_prism(materials):
    profile = [
        (-1.28, 0.32),
        (-1.28, 5.72),
        (-0.48, 6.18),
        (1.28, 6.18),
        (1.28, 0.32),
    ]
    outer = add_prism_profile("Futarchy Decision Glass", profile, 0.65, materials["glass"], 0.14)
    outer.location.x = -0.08
    return outer


def add_plinth(name, location, top_height, ceramic, chrome):
    add_disc(f"{name} Base", (location[0], location[1], 0.115), 0.75, 0.16, ceramic)
    add_disc(
        f"{name} Ceramic Pedestal",
        (location[0], location[1], top_height * 0.5),
        0.67,
        top_height - 0.23,
        ceramic,
    )
    add_disc(f"{name} Chrome Collar", (location[0], location[1], top_height - 0.035), 0.675, 0.025, chrome)
    add_disc(f"{name} Ceramic Cap", (location[0], location[1], top_height + 0.07), 0.75, 0.12, ceramic)
    return top_height + 0.14


def add_beam(start, end, core, soft_glow, outer_glow, core_radius=0.042):
    add_cylinder_between(f"{core.name} Shell", start, end, core_radius * 1.8, soft_glow, 32)
    add_cylinder_between(f"{core.name} Halo", start, end, core_radius * 3.2, outer_glow, 32)
    add_cylinder_between(core.name, start, end, core_radius, core, 24)


def add_light(name, location, energy, size, color, target=(0, 0, 2.3)):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.shape = "DISK"
    data.size = size
    data.color = color
    light = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(light)
    light.location = location
    direction = Vector(target) - light.location
    light.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return light


def configure_camera():
    data = bpy.data.cameras.new("Product Camera")
    camera = bpy.data.objects.new("Product Camera", data)
    bpy.context.collection.objects.link(camera)
    camera.location = (8.0, -28.5, 16.0)
    target = Vector((-0.25, 0.0, 2.7))
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    data.lens = 57
    data.sensor_width = 36
    data.dof.use_dof = True
    data.dof.focus_distance = (target - camera.location).length
    data.dof.aperture_fstop = 14.0
    bpy.context.scene.camera = camera


def configure_cycles():
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 96
    scene.cycles.use_denoising = True
    scene.cycles.denoiser = "OPENIMAGEDENOISE"
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.035
    scene.cycles.time_limit = 75
    scene.cycles.max_bounces = 8
    scene.cycles.diffuse_bounces = 4
    scene.cycles.glossy_bounces = 6
    scene.cycles.transmission_bounces = 8
    scene.cycles.transparent_max_bounces = 16
    scene.cycles.caustics_reflective = True
    scene.cycles.caustics_refractive = True
    scene.render.resolution_x = 1600
    scene.render.resolution_y = 1200
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.film_transparent = False
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.view_settings.exposure = -0.15
    scene.view_settings.gamma = 1.0

    world = scene.world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    for node in list(nodes):
        nodes.remove(node)
    output = nodes.new("ShaderNodeOutputWorld")
    mix = nodes.new("ShaderNodeMixShader")
    camera_ray = nodes.new("ShaderNodeLightPath")
    studio_light = nodes.new("ShaderNodeBackground")
    camera_white = nodes.new("ShaderNodeBackground")
    studio_light.inputs["Color"].default_value = (1, 1, 1, 1)
    studio_light.inputs["Strength"].default_value = 0.28
    camera_white.inputs["Color"].default_value = (1, 1, 1, 1)
    camera_white.inputs["Strength"].default_value = 18.0
    links.new(camera_ray.outputs["Is Camera Ray"], mix.inputs[0])
    links.new(studio_light.outputs["Background"], mix.inputs[1])
    links.new(camera_white.outputs["Background"], mix.inputs[2])
    links.new(mix.outputs["Shader"], output.inputs["Surface"])

    preferences = bpy.context.preferences.addons.get("cycles")
    if preferences:
        cycles_preferences = preferences.preferences
        for device_type in ("METAL", "OPTIX", "CUDA", "HIP"):
            try:
                cycles_preferences.compute_device_type = device_type
                cycles_preferences.get_devices()
                devices = cycles_preferences.devices
                for device in devices:
                    device.use = device.type == device_type
                if any(device.use for device in devices):
                    scene.cycles.device = "GPU"
                    break
            except Exception:
                continue
        else:
            scene.cycles.device = "CPU"


def build_scene():
    clean_scene()
    configure_cycles()

    ceramic = ceramic_material()
    chrome = chrome_material()
    materials = {
        "ceramic": ceramic,
        "chrome": chrome,
        "glass": glass_material(),
        "violet_core": violet_core_material(),
    }
    add_plane("Seamless White Studio Floor", 2000, (0, 0, 0), floor_material())
    add_prism(materials)

    add_beveled_cube(
        "Prism Ceramic Foot",
        (-0.08, 0, 0.14),
        (1.52, 0.91, 0.14),
        ceramic,
        bevel=0.12,
        segments=6,
    )
    add_beveled_cube(
        "Prism Chrome Seam",
        (-0.08, 0, 0.315),
        (1.38, 0.78, 0.034),
        chrome,
        bevel=0.025,
        segments=3,
    )

    preferred = (6.62, -2.35, 0.0)
    alternative = (6.78, 3.25, 0.0)
    preferred_top = add_plinth("Preferred Future", preferred, 1.34, ceramic, chrome)
    alternative_top = add_plinth("Alternative Future", alternative, 1.34, ceramic, chrome)

    input_core = soft_beam_material("Input Beam Core", (1.0, 0.985, 1.0, 1.0), 15.0)
    input_soft = soft_beam_material("Input Beam Soft Glow", (0.90, 0.83, 1.0, 1.0), 1.7, 0.12)
    input_outer = soft_beam_material("Input Beam Wide Halo", hex_rgba("#A68CFF"), 0.28, 0.04)
    preferred_core = soft_beam_material("Preferred Path Core", hex_rgba("#6C47FF"), 3.2)
    preferred_soft = soft_beam_material("Preferred Path Soft Glow", hex_rgba("#8C69FF"), 1.55, 0.12)
    preferred_outer = soft_beam_material("Preferred Path Wide Halo", hex_rgba("#6C47FF"), 0.32, 0.04)
    alternative_core = soft_beam_material("Alternative Path Core", hex_rgba("#6C47FF"), 0.65)
    alternative_soft = soft_beam_material("Alternative Path Soft Glow", hex_rgba("#6C47FF"), 0.72, 0.08)
    alternative_outer = soft_beam_material("Alternative Path Wide Halo", hex_rgba("#6C47FF"), 0.14, 0.025)

    add_beam((-8.15, -0.02, 3.88), (-1.30, -0.02, 3.88), input_core, input_soft, input_outer, 0.055)
    add_beam(
        (1.22, -0.08, 3.76),
        (6.62, -2.35, preferred_top + 0.035),
        preferred_core,
        preferred_soft,
        preferred_outer,
        0.058,
    )
    add_beam(
        (1.22, 0.08, 3.92),
        (6.78, 3.25, alternative_top + 0.035),
        alternative_core,
        alternative_soft,
        alternative_outer,
        0.042,
    )

    landing_preferred = emission_material("Preferred Landing Glow", hex_rgba("#6C47FF"), 2.0)
    landing_alternative = emission_material("Alternative Landing Glow", hex_rgba("#6C47FF"), 0.65)
    add_disc("Preferred Landing", (preferred[0], preferred[1], preferred_top + 0.012), 0.22, 0.018, landing_preferred)
    add_disc(
        "Alternative Landing",
        (alternative[0], alternative[1], alternative_top + 0.012),
        0.17,
        0.016,
        landing_alternative,
    )

    add_light("Large Softbox Key", (-7.5, -9.5, 14.5), 2000, 9.5, (1.0, 0.96, 0.92))
    add_light("Cool Ceramic Fill", (11.5, -4.5, 9.5), 650, 8.0, (0.83, 0.86, 1.0))
    add_light("White Back Sweep", (-2.0, 10.5, 12.5), 1400, 11.0, (1.0, 1.0, 1.0))
    add_light("Violet Optical Accent", (1.2, -3.2, 8.8), 120, 3.8, (0.48, 0.30, 1.0), (0.0, 0.0, 3.25))

    configure_camera()
    bpy.context.scene.render.filepath = OUTPUT_PATH


if __name__ == "__main__":
    build_scene()
    bpy.ops.render.render(write_still=True)
