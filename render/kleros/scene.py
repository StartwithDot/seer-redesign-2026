import bpy, math, os, time
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, color, metallic=0, roughness=.3, transmission=0):
    m=bpy.data.materials.new(name); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Metallic'].default_value=metallic; p.inputs['Roughness'].default_value=roughness
    p.inputs['Transmission Weight'].default_value=transmission; p.inputs['IOR'].default_value=1.46
    return m
ceramic=material('Satin white porcelain',(.88,.88,.88),roughness=.29)
glass=material('Deep violet optical glass',(.15,.025,.95),roughness=.045,transmission=.58)
absorb=glass.node_tree.nodes.new('ShaderNodeVolumeAbsorption')
absorb.inputs['Color'].default_value=(.24,.045,.95,1)
absorb.inputs['Density'].default_value=2.2
glass.node_tree.links.new(absorb.outputs['Volume'],glass.node_tree.nodes.get('Material Output').inputs['Volume'])
chrome=material('Polished platinum',(.72,.77,.84),metallic=1,roughness=.16)
floor=material('White seamless',(1,1,1),roughness=.22)
lightmat=material('Soft verdict light',(1,1,1),roughness=.2)
p=lightmat.node_tree.nodes.get('Principled BSDF'); p.inputs['Emission Color'].default_value=(1,1,1,1); p.inputs['Emission Strength'].default_value=2

def box(name,loc,scale,mat,bevel=.025,angle=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    ob=bpy.context.object; ob.name=name; ob.dimensions=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    ob.rotation_euler[2]=angle
    ob.data.materials.append(mat)
    if bevel:
        mod=ob.modifiers.new('Precision softened edges','BEVEL'); mod.width=bevel; mod.segments=5
        mod=ob.modifiers.new('Weighted surface normals','WEIGHTED_NORMAL')
    return ob
# Nine equal-width juror tablets form a single deliberate semicircle behind the verdict.
for i in range(9):
    t=math.radians(-78+i*19.5)
    x=2.95*math.sin(t); y=.70+1.90*math.cos(t)
    h=1.70+1.28*math.cos(t)
    a=-t*.22
    box('Juror %02d ceramic body'%(i+1),(x,y,h/2+.025),(.43,.24,h),ceramic,.028,a)
    # Inset violet glass on the face, surrounded by a narrow porcelain reveal.
    dx=math.sin(a)*.162; dy=-math.cos(a)*.162
    box('Juror %02d violet glass inset'%(i+1),(x+dx,y+dy,h/2+.025),(.255,.095,h-.30),glass,.018,a)
    box('Juror %02d platinum foot'%(i+1),(x,y,.038),(.435,.245,.06),chrome,.012,a)
# Ceramic verdict slab with a glass-filled, razor-fine luminous vertical joint.
box('Central verdict monolith',(0,-.72,1.65),(1.10,.35,3.2),ceramic,.025)
box('Platinum recessed seam surround',(0,-.898,1.65),(.060,.016,2.99),chrome,.009)
box('Violet verdict glass',(0,-.911,1.65),(.032,.025,2.96),glass,.009)
box('Continuous soft white verdict',(0,-.926,1.65),(.007,.006,2.89),lightmat,.002)
box('Verdict platinum foundation',(0,-.72,.06),(1.105,.355,.065),chrome,.012)
box('Seamless studio floor',(0,0,-.025),(200,200,.05),floor,.0)
world=bpy.data.worlds.new('Pure white studio'); bpy.context.scene.world=world; world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(1,1,1,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.8

def area(name,location,power,size,target,color=(1,1,1),shape='DISK',size_y=None):
    bpy.ops.object.light_add(type='AREA',location=location)
    ob=bpy.context.object; ob.name=name; ob.data.energy=power; ob.data.shape=shape; ob.data.size=size
    if size_y is not None: ob.data.size_y=size_y
    ob.data.color=color; ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
area('Large softbox upper left',(-3.5,-4.5,7),1100,5.0,(0,.4,1.3))
area('Tall glass reflection strip',(4,-1,4.3),400,1.8,(0,.6,1.4),shape='RECTANGLE',size_y=5)
area('Soft rear edge',(-1,4,6),650,3,(0,1,1.6))
bpy.ops.object.camera_add(location=(1.4,-15,6.0))
cam=bpy.context.object; cam.rotation_euler=(Vector((0,.65,1.53))-cam.location).to_track_quat('-Z','Y').to_euler()
cam.data.type='ORTHO'; cam.data.ortho_scale=7.8; bpy.context.scene.camera=cam
scene=bpy.context.scene; scene.render.engine='CYCLES'; scene.cycles.samples=96; scene.cycles.use_denoising=True
scene.cycles.max_bounces=8; scene.cycles.transmission_bounces=6
scene.cycles.adaptive_threshold=.035
scene.cycles.time_limit=75
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type='METAL'; prefs.get_devices()
    found=False
    for device in prefs.devices:
        device.use=device.type=='METAL'; found=found or device.use
    scene.cycles.device='GPU' if found else 'CPU'
except Exception: scene.cycles.device='CPU'
scene.render.resolution_x=1600; scene.render.resolution_y=1200; scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'; scene.render.filepath=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out.png')
scene.view_settings.view_transform='AgX'; scene.view_settings.look='AgX - Medium High Contrast'
scene.view_settings.exposure=.65
scene.render.film_transparent=False
bpy.ops.render.render(write_still=True)
