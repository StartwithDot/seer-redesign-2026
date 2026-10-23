"""Lens sculpture. Blender -b -P render/lens/scene.py -- still|anim."""
import bpy, math, sys
from pathlib import Path
from mathutils import Vector
ROOT = Path(__file__).resolve().parent
MODE = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else 'still'
if MODE not in {'still', 'anim'}:
    raise ValueError('Expected still or anim')
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
s = bpy.context.scene
s.render.engine = 'CYCLES'
s.cycles.samples = 128 if MODE == 'still' else 48
s.cycles.use_denoising = True
s.cycles.adaptive_threshold = .035
s.cycles.time_limit = 80 if MODE == 'still' else 0
s.render.use_file_extension = True
s.cycles.denoiser = 'OPENIMAGEDENOISE'
s.cycles.max_bounces = 18
s.cycles.transmission_bounces = 12
s.cycles.caustics_reflective = True
s.cycles.caustics_refractive = True
s.cycles.sample_clamp_indirect = 10
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'; prefs.get_devices()
    for dev in prefs.devices: dev.use = dev.type == 'METAL'
    s.cycles.device = 'GPU' if any(d.type == 'METAL' for d in prefs.devices) else 'CPU'
except Exception:
    s.cycles.device = 'CPU'
s.render.resolution_x, s.render.resolution_y = (2400,1500) if MODE == 'still' else (1440,900)
s.render.resolution_percentage = 100
s.render.image_settings.file_format = 'PNG'
s.view_settings.view_transform = 'Standard'
s.view_settings.look = 'None'
s.view_settings.exposure = 0
s.world.use_nodes = True
s.world.node_tree.nodes['Background'].inputs[0].default_value = (1,1,1,1)
# Ambient illumination is separate from the camera-visible white studio.
# Lower ambient light preserves the ceramic's soft shadow-side gradient.
s.world.node_tree.nodes['Background'].inputs[1].default_value = .12

world_nodes=s.world.node_tree.nodes
world_links=s.world.node_tree.links
path=world_nodes.new('ShaderNodeLightPath')
white=world_nodes.new('ShaderNodeBackground'); white.inputs[0].default_value=(.964686,.964686,.973445,1); white.inputs[1].default_value=1
mix=world_nodes.new('ShaderNodeMixShader')
world_links.new(path.outputs['Is Camera Ray'],mix.inputs[0])
world_links.new(world_nodes['Background'].outputs[0],mix.inputs[1])
world_links.new(white.outputs[0],mix.inputs[2])
world_links.new(mix.outputs[0],world_nodes['World Output'].inputs['Surface'])

def linear(h):
    v = [int(h[i:i+2],16)/255 for i in (0,2,4)]
    return tuple(c/12.92 if c < .04045 else ((c+.055)/1.055)**2.4 for c in v)+(1,)
def material(name, color, rough):
    m=bpy.data.materials.new(name); m.diffuse_color=linear(color); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=linear(color); p.inputs['Roughness'].default_value=rough
    return m,p
ceramic,p=material('Soft white ceramic EDEDF0','EDEDF0',.70); p.inputs['Coat Weight'].default_value=.025
p.inputs['Specular IOR Level'].default_value=.18
p.inputs['Transmission Weight'].default_value=0
floor,p=material('White polished studio','FAFAFB',.12)
# Camera-visible seamless white stays bright independently of sculpture lighting.
# Retain a small contribution from the physical floor for soft reflections/shadows.
p.inputs['Emission Strength'].default_value=0
fn=floor.node_tree.nodes; fl=floor.node_tree.links
floor_path=fn.new('ShaderNodeLightPath')
floor_white=fn.new('ShaderNodeEmission')
floor_white.inputs['Color'].default_value=linear('FBFBFC')
floor_white.inputs['Strength'].default_value=1
floor_mix=fn.new('ShaderNodeMixShader')
floor_camera=fn.new('ShaderNodeMath'); floor_camera.operation='MULTIPLY'
floor_camera.inputs[1].default_value=.90
fl.new(floor_path.outputs['Is Camera Ray'],floor_camera.inputs[0])
fl.new(floor_camera.outputs[0],floor_mix.inputs[0])
fl.new(p.outputs['BSDF'],floor_mix.inputs[1])
fl.new(floor_white.outputs[0],floor_mix.inputs[2])
fl.new(floor_mix.outputs[0],fn['Material Output'].inputs['Surface'])
glass,p=material('Violet optical glass','F5E8FF',.012)
p.inputs['Transmission Weight'].default_value=1; p.inputs['IOR'].default_value=1.45
absorb=glass.node_tree.nodes.new('ShaderNodeVolumeAbsorption'); absorb.inputs['Color'].default_value=linear('713DF5'); absorb.inputs['Density'].default_value=1.65
glass.node_tree.links.new(absorb.outputs['Volume'],glass.node_tree.nodes['Material Output'].inputs['Volume'])
# Closed annular profile: actual open hole, four rounded ceramic edges.
N=256
verts=[]
for r,z in [(2,-.275),(2,.275),(1.55,.275),(1.55,-.275)]:
    verts.extend([(r*math.cos(i*2*math.pi/N),r*math.sin(i*2*math.pi/N),z) for i in range(N)])
faces=[]
for j in range(4):
    for i in range(N):
        k=(i+1)%N; q=(j+1)%4
        faces.append((j*N+i,j*N+k,q*N+k,q*N+i))
mesh=bpy.data.meshes.new('Annular ceramic profile'); mesh.from_pydata(verts,[],faces); mesh.update()
ring=bpy.data.objects.new('Ceramic annulus',mesh); bpy.context.collection.objects.link(ring); ring.data.materials.append(ceramic)
for f in mesh.polygons: f.use_smooth=True
bevel=ring.modifiers.new('Four softly rounded edges','BEVEL'); bevel.width=.04; bevel.segments=4
normal=ring.modifiers.new('Weighted ceramic normals','WEIGHTED_NORMAL'); normal.keep_sharp=True
bpy.ops.mesh.primitive_uv_sphere_add(segments=256,ring_count=128)
lens=bpy.context.object; lens.name='Floating biconvex violet lens'; lens.scale=(1.5,1.5,.275)
bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
lens.data.materials.append(glass)
for f in lens.data.polygons:f.use_smooth=True
axis=Vector((.48,-.32,.817)).normalized(); orientation=Vector((0,0,1)).rotation_difference(axis)
# Exact contact height of a tilted finite cylinder.
height=2*math.sqrt(1-axis.z**2)+.275*abs(axis.z)
center=Vector((2.05,0,height))
for ob in (ring,lens): ob.rotation_mode='QUATERNION'; ob.rotation_quaternion=orientation; ob.location=center
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.015)); bpy.context.object.name='Seamless reflective white floor'; bpy.context.object.data.materials.append(floor)
def area(name,pos,power,size,color=(1,1,1),target=center,shape='DISK',size_y=None):
    data=bpy.data.lights.new(name,'AREA'); data.energy=power; data.shape=shape; data.size=size; data.color=color
    if size_y is not None:data.size_y=size_y
    ob=bpy.data.objects.new(name,data); bpy.context.collection.objects.link(ob); ob.location=pos; ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler(); return ob
# The camera-only white world/floor provide the bright seamless background;
# restrained illumination leaves a readable grey-to-white ceramic gradient.
area('Upper left six metre softbox',(-4,-4,8),60,6)
area('Broad right fill',(7,-1,5),10,5)
strip=area('White transmission halo strip',(2.0,2.5,4.2),95,4,target=center,shape='RECTANGLE',size_y=.12)
area('Violet inner wall and floor spill',(2.1,1,1.0),18,2.5,(.65,.42,1),target=(2.3,-.5,.1))
area('Front glass highlight',(-1,-5,5),9,4,target=center,shape='RECTANGLE',size_y=.055)
# Keep low-energy strips below Standard-view clipping; the white floor
# supplies the refracted halo while absorption colours the optical path.
# Grazing violet strip creates an elongated reflected light streak toward lower-left.
area('Violet grazing caustic strip',(3.3,1.5,1.6),48,3.5,(.55,.16,1),target=(-1.8,-2.4,0),shape='RECTANGLE',size_y=.12)
bpy.ops.object.camera_add(location=(0,-21,6.3))
cam=bpy.context.object; cam.rotation_euler=(Vector((.1,0,1.35))-cam.location).to_track_quat('-Z','Y').to_euler(); cam.data.lens=85; cam.data.dof.use_dof=True; cam.data.dof.focus_distance=(center-cam.location).length; cam.data.dof.aperture_fstop=8; s.camera=cam
if MODE == 'anim':
    s.render.fps=24; s.frame_start=1; s.frame_end=96
    from mathutils import Quaternion
    for frame in range(0,97):
        phase=2*math.pi*frame/96
        lens.rotation_quaternion=orientation @ Quaternion((0,1,0),math.radians(4)*math.sin(phase)) @ Quaternion((1,0,0),math.radians(2)*math.sin(phase))
        lens.keyframe_insert(data_path='rotation_quaternion',frame=frame)
        for ob in (ring,lens):
            ob.location=center+Vector((.025*math.sin(phase),0,0)); ob.keyframe_insert(data_path='location',frame=frame)
        strip.location.x=2+1.5*math.sin(phase); strip.rotation_euler=(center-strip.location).to_track_quat('-Z','Y').to_euler()
        strip.keyframe_insert(data_path='location',frame=frame); strip.keyframe_insert(data_path='rotation_euler',frame=frame)
    (ROOT/'frames').mkdir(exist_ok=True); s.render.filepath=str(ROOT/'frames'/'f_'); bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'scene.blend')); bpy.ops.render.render(animation=True)
else:
    s.render.filepath=str(ROOT/'out.png'); bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'scene.blend')); bpy.ops.render.render(write_still=True)
