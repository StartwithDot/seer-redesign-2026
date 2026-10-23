import bpy, bmesh, math, sys, os, time
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
def mat(name,color,metal=0,rough=.3,trans=0):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1); p.inputs['Metallic'].default_value=metal; p.inputs['Roughness'].default_value=rough; p.inputs['Transmission Weight'].default_value=trans; p.inputs['IOR'].default_value=1.46
 return m
ceramic=mat('Warm white satin ceramic',(.91,.915,.93),rough=.27)
white=mat('White glazed floor',(.98,.98,.98),rough=.16)
channel=mat('Recess white ceramic',(.53,.52,.60),rough=.28)
chrome=mat('Polished platinum',(.77,.8,.86),1,.17)
glass=[]
for i in range(25):
 t=i/24; glass.append(mat('Optical violet %02d'%i,(.31-.13*t,.095-.045*t,1.0-.12*t),rough=.065,trans=.82))
# A physical glazed floor retains contact shadows and the instrument reflection.
fp=white.node_tree.nodes.get('Principled BSDF')
fp.inputs['Emission Color'].default_value=(1,1,1,1)
fp.inputs['Emission Strength'].default_value=.68
for gm in glass:
 gp=gm.node_tree.nodes.get('Principled BSDF')
 gp.inputs['Coat Weight'].default_value=.3
 gp.inputs['Coat Roughness'].default_value=.035
 absorption=gm.node_tree.nodes.new('ShaderNodeVolumeAbsorption')
 absorption.inputs['Color'].default_value=(.46,.19,.95,1)
 absorption.inputs['Density'].default_value=1.25
 gm.node_tree.links.new(absorption.outputs['Volume'],gm.node_tree.nodes.get('Material Output').inputs['Volume'])

def finish(o,name,material,bevel=.03):
 o.name=name; o.data.materials.append(material)
 if bevel:
  b=o.modifiers.new('Precision rounded edges','BEVEL'); b.width=bevel;b.segments=3
 if o.type=='MESH':
  for p in o.data.polygons:p.use_smooth=True
  o.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL')
 return o
def cyl(name,r,depth,loc,material,bevel=.03):
 bpy.ops.mesh.primitive_cylinder_add(vertices=128,radius=r,depth=depth,location=loc,rotation=(math.pi/2,0,0));return finish(bpy.context.object,name,material,bevel)
def box(name,loc,scale,material,bevel=.05):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.dimensions=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);return finish(o,name,material,bevel)
Z=2.03
def arc(name,ri,ro,a,b,y,depth,material,bev=.012):
 n=max(4,int(abs(b-a)*1.2));verts=[]
 for yy in (y-depth/2,y+depth/2):
  for r in (ri,ro):
   for j in range(n+1):
    th=math.radians(a+(b-a)*j/n);verts.append((r*math.cos(th),yy,Z+r*math.sin(th)))
 k=n+1;faces=[]
 for j in range(n):
  faces.extend([(j,j+1,k+j+1,k+j),(2*k+j,3*k+j,3*k+j+1,2*k+j+1),(j,2*k+j,2*k+j+1,j+1),(k+j,k+j+1,3*k+j+1,3*k+j)])
 if abs(b-a)<359.99: faces.extend([(0,k,3*k,2*k),(n,2*k+n,3*k+n,k+n)])
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
 if abs(b-a)>=359.99:
  bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.0001);bm.to_mesh(mesh);bm.free()
 o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);return finish(o,name,material,bev)
# The open annulus is a real recessed channel between the centre and outer rim.
cyl('Ceramic instrument body',1.6,.35,(0,0,Z),ceramic,.065)
arc('Continuous outer ceramic bezel',1.355,1.59,0,360,-.218,.14,ceramic,.025)
cyl('Raised central ceramic face',1.055,.105,(0,-.218,Z),ceramic,.025)
arc('Machined arc channel bed',1.076,1.333,210,-30,-.183,.025,channel,.008)
# Close the unused bottom portion of the channel with matching ceramic.
arc('Solid bottom dial bridge',1.035,1.38,210,330,-.22,.14,ceramic,.018)
count=25
for i in range(count):
 a=210-i*6.24; b=a-5.45
 arc('Violet glass calibrated segment %02d'%i,1.09,1.32,a,b,-.26,.135,glass[i],.014)
# Small engraved-looking tick recesses, without numerals.
for i in range(41):
 angle=math.radians(210-i*6);r=.975 if i%5==0 else .989
 o=box('Fine radial index %02d'%i,(r*math.cos(angle),-.274,Z+r*math.sin(angle)),(.07 if i%5==0 else .035,.006,.009),channel,.003);o.rotation_euler[1]=-angle
# Precision tapering chrome pointer, from the central pivot to the fill boundary.
a=math.radians(54);d=Vector((math.cos(a),0,math.sin(a)));q=Vector((-math.sin(a),0,math.cos(a)))
pts=[]
for yy in (-.328,-.303):
 for v in (-d*.18-q*.044,-d*.18+q*.044,d*1.24):pts.append((v.x,yy,Z+v.z))
mesh=bpy.data.meshes.new('Needle');mesh.from_pydata(pts,[],[(0,1,2),(3,5,4),(0,3,4,1),(1,4,5,2),(2,5,3,0)]);mesh.update();o=bpy.data.objects.new('Tapered chrome indicator',mesh);bpy.context.collection.objects.link(o);finish(o,o.name,chrome,.009)
cyl('Chrome pivot surround',.145,.075,(0,-.337,Z),chrome,.018)
cyl('Violet optical pivot cap',.111,.059,(0,-.386,Z),glass[12],.027)
box('Ceramic pedestal', (0,.05,.125),(1.5,.92,.25),ceramic,.11)
box('Short chrome support',(0,.065,.455),(.39,.28,.5),ceramic,.045)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.012));finish(bpy.context.object,'Seamless glossy white studio',white,0)
world=bpy.context.scene.world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(1,1,1,1);world.node_tree.nodes['Background'].inputs[1].default_value=.5
wn=world.node_tree; bg=wn.nodes.get('Background'); output=wn.nodes.get('World Output'); camera_bg=wn.nodes.new('ShaderNodeBackground');camera_bg.inputs[0].default_value=(1,1,1,1);camera_bg.inputs[1].default_value=1
ray=wn.nodes.new('ShaderNodeLightPath');mix=wn.nodes.new('ShaderNodeMixShader');wn.links.new(ray.outputs['Is Camera Ray'],mix.inputs[0]);wn.links.new(bg.outputs[0],mix.inputs[1]);wn.links.new(camera_bg.outputs[0],mix.inputs[2]);wn.links.new(mix.outputs[0],output.inputs['Surface'])
def area(name,loc,power,size,target,color=(1,1,1),shape='DISK',size_y=None):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.shape=shape;o.data.size=size;o.data.color=color
 if size_y is not None:o.data.size_y=size_y
 o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
area('Large softbox key',(-3.5,-4.5,7),850,4.0,(0,0,2))
area('Tall glass reflection',(3,-4,4.5),380,1.2,(0,0,2),shape='RECTANGLE',size_y=4)
area('Soft ceramic rim',(1.5,3,6),600,3.5,(0,0,2))
bpy.ops.object.camera_add(location=(4.4,-11,4.5));camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,1.85))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=6.65;bpy.context.scene.camera=camera
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=96;scene.cycles.use_denoising=True
try:
 prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
 for device in prefs.devices:device.use=device.type=='METAL'
 scene.cycles.device='GPU' if any(d.type=='METAL' for d in prefs.devices) else 'CPU'
except Exception:scene.cycles.device='CPU'
scene.render.resolution_x=1600;scene.render.resolution_y=1200;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX';scene.view_settings.exposure=.15;scene.view_settings.look='AgX - Medium High Contrast';scene.render.image_settings.file_format='PNG';scene.render.filepath=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out.png')
scene.render.film_transparent=False;scene.render.threads_mode='AUTO';scene.cycles.time_limit=75;scene.cycles.max_bounces=8;scene.cycles.transmission_bounces=6
bpy.ops.render.render(write_still=True)
