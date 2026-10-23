# Headless: Blender -b -P render/hero/scene.py
# Original architectural study: broad ceramic bands around a single violet lens.
import bpy, bmesh, math, os, time
from mathutils import Vector
from math import sin, cos, pi
ROOT=os.path.dirname(os.path.abspath(__file__))
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=96
scene.cycles.use_denoising=True
scene.cycles.max_bounces=8
scene.cycles.transmission_bounces=6
scene.cycles.transparent_max_bounces=6
scene.cycles.adaptive_threshold=0.045
scene.cycles.time_limit=185
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type='METAL'; prefs.get_devices()
    gpu=False
    for d in prefs.devices:
        d.use=d.type=='METAL'; gpu|=d.use
    scene.cycles.device='GPU' if gpu else 'CPU'
except Exception: scene.cycles.device='CPU'
scene.render.resolution_x=2400; scene.render.resolution_y=1500; scene.render.resolution_percentage=100
scene.render.film_transparent=False
scene.render.image_settings.file_format='PNG'; scene.render.image_settings.color_mode='RGB'; scene.render.image_settings.color_depth='8'
scene.render.filepath=os.path.join(ROOT,'out.png')
scene.view_settings.view_transform='AgX'
try: scene.view_settings.look='None'
except: pass
scene.view_settings.exposure=0.35
world=bpy.data.worlds.new('White studio'); scene.world=world; world.use_nodes=True
world.node_tree.nodes['Background'].inputs['Color'].default_value=(1,1,1,1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value=0.28

def material(name,color,roughness,metallic=0):
    m=bpy.data.materials.new(name); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1); p.inputs['Roughness'].default_value=roughness; p.inputs['Metallic'].default_value=metallic
    return m
white=material('Warm white honed porcelain',(.82,.81,.80),.39)
p=white.node_tree.nodes.get('Principled BSDF'); p.inputs['Specular IOR Level'].default_value=.32
floor=material('Seamless chalk white',(.94,.935,.93),.34)
glass=material('Violet cast optical acrylic',(.24,.075,.80),.095)
p=glass.node_tree.nodes.get('Principled BSDF'); p.inputs['Transmission Weight'].default_value=.96; p.inputs['IOR'].default_value=1.46
p.inputs['Coat Weight'].default_value=.24
# A very faint intrinsic violet luminance keeps the thick polished acrylic luminous.
p.inputs['Emission Color'].default_value=(.19,.035,.8,1); p.inputs['Emission Strength'].default_value=.015

def band(name,outer,inner,start,end,bottom,top,mat,steps=240,bevel=.035):
    verts=[]
    for i in range(steps+1):
        u=i/steps; a=start+(end-start)*u
        z0=bottom(u) if callable(bottom) else bottom
        z1=top(u) if callable(top) else top
        for r,z in [(outer,z0),(outer,z1),(inner,z0),(inner,z1)]: verts.append((r*cos(a),r*sin(a),z))
    faces=[]
    for i in range(steps):
        k=4*i; n=k+4
        faces.extend([(k,n,n+1,k+1),(k+2,k+3,n+3,n+2),(k+1,n+1,n+3,k+3),(k,k+2,n+2,n)])
    if abs(end-start-2*pi)>1e-6:
        faces.extend([(0,1,3,2),(4*steps,4*steps+2,4*steps+3,4*steps+1)])
    mesh=bpy.data.meshes.new(name); mesh.from_pydata(verts,[],faces); mesh.update()
    if abs(end-start-2*pi)<1e-6:
        bm=bmesh.new(); bm.from_mesh(mesh)
        bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=0.00001)
        bm.to_mesh(mesh); bm.free(); mesh.update()
    obj=bpy.data.objects.new(name,mesh); bpy.context.collection.objects.link(obj); obj.data.materials.append(mat)
    for f in mesh.polygons: f.use_smooth=f.index<steps*4 and f.index%4<2
    mod=obj.modifiers.new('Soft manufactured edge highlights','BEVEL'); mod.width=bevel; mod.segments=3
    mod=obj.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL'); mod.keep_sharp=True; mod.weight=40
    return obj
# The upper hollow drum: a broad horizontal soffit, real wall thickness, open sky through its centre.
band('Upper suspended annular drum',2.85,1.90,0,2*pi,3.18,4.48,white)
# Curving architectural ramp behind and around the central core. The left exposed cut is tall.
band('Sweeping rising rear wall',3.00,2.38,math.radians(30),math.radians(216),.025,lambda u:1.65+0.70*u,white)
# Broad ribbon slab winds down from the rear to the foreground, with a white soffit.
band('Descending spiral ribbon',2.78,1.18,math.radians(50),math.radians(315),lambda u:1.91-1.13*u,lambda u:2.25-1.13*u,white)
# Low foreground drum conceals the lower ribbon edge and anchors the object to the floor.
band('Foreground low sculpted drum',2.96,1.93,math.radians(180),math.radians(378),.025,.85,white)
# A smaller inner scroll curls in on the right, visible through the great ring.
band('Inner curling parapet',1.82,1.12,math.radians(-55),math.radians(112),.83,1.90,white)
# Single translucent curved central panel, thick enough to refract the white bands behind it.
band('Single curved violet acrylic lens',1.48,1.40,math.radians(185),math.radians(326),1.20,3.43,glass,steps=160,bevel=.025)
bpy.ops.mesh.primitive_plane_add(size=2000,location=(0,0,0)); bpy.context.object.name='Infinite white cyclorama'; bpy.context.object.data.materials.append(floor)

def area(name,loc,power,size,color,target=(0,0,2),shape='RECTANGLE',size_y=None):
    data=bpy.data.lights.new(name,'AREA'); data.energy=power; data.shape=shape; data.size=size; data.color=color
    if shape=='RECTANGLE': data.size_y=size_y or size*1.4
    ob=bpy.data.objects.new(name,data); bpy.context.collection.objects.link(ob); ob.location=loc; ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
area('Large softbox upper left',( -3,4,8),1250,4,(1,.97,.94))
area('Tall right reflection strip',(6,-1,6),1550,5,(1,1,1),shape='RECTANGLE',size_y=8)
area('Broad ceiling wash',(0,1,11),1800,12,(1,1,1),target=(0,0,0))
area('Back rim softbox',(-1,-6,7),180,7,(.95,.96,1))
area('Violet bounced light inside sculpture',(0,-.15,2.7),45,2,(.43,.18,1),target=(0,-1,0))
bpy.ops.object.camera_add(location=(5,-18,3.65))
cam=bpy.context.object; cam.name='Hero camera'; cam.rotation_euler=(Vector((0,0,2.45))-cam.location).to_track_quat('-Z','Y').to_euler(); cam.data.type='PERSP'; cam.data.shift_x=-.22
scene.camera=cam; cam.data.lens=49
nodes=world.node_tree.nodes; links=world.node_tree.links
ambient=nodes.get('Background'); output=nodes.get('World Output')
visible=nodes.new('ShaderNodeBackground'); visible.inputs['Color'].default_value=(1,1,1,1); visible.inputs['Strength'].default_value=2.5
path=nodes.new('ShaderNodeLightPath'); mix=nodes.new('ShaderNodeMixShader')
links.new(path.outputs['Is Camera Ray'],mix.inputs[0]); links.new(ambient.outputs[0],mix.inputs[1]); links.new(visible.outputs[0],mix.inputs[2]); links.new(mix.outputs[0],output.inputs['Surface'])
# Keep the beauty render independent of optional depth compositing.
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'scene.blend'))
bpy.ops.render.render(write_still=True)
print('HERO_RENDER_COMPLETE',scene.cycles.device)
