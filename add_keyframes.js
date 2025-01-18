function Divide(value,snap){
    return parseInt(value/snap)*snap
}
function All_keyframes(anim){
    var keyframes = [];
    Group.all.forEach(group =>{
        ["rotation","position","scale"].forEach(Eachtype => {
            anim.getBoneAnimator(group)[Eachtype].forEach(K => {
                keyframes.push(K)
            })
        })
    })
    return keyframes
}
(function() {
    var button;

    BBPlugin.register('add_keyframes', {
        title: '关键帧操作',
        author: '尐贤之辈のTENO',
        description: '使全部组在时间标处添加关键帧',
        icon: 'play_arrow',
        version: '0.0.1',
        about:"此插件可以为所有组在时间标位置打上关键帧（含快捷键）与随机偏移关键帧",
        tags: ["keyframes"],
        variant: 'both',
        onload() {
            add_key_button = new Action('add_keyframes', {
                name: '全体添加关键帧',
                description: '全部组在时间标处添加关键帧',
                icon: 'icon-keyframe',
                condition:() => Animation.all.length!=0,
                keybind: new Keybind({key: 'i', ctrl: true, alt: true}),
                click: function() {
                    //console.log(Animation.all);
                    keyframes=[]
                    Undo.initEdit({keyframes});
                    Group.all.forEach(group => {
                        ["rotation","position","scale"].forEach(type => {
                        keyframes.push(Animation.selected.getBoneAnimator(group)
                        .createKeyframe(null, Timeline.time, type, false, false));
                        })
                    });
                    //Timeline.selected_animator.createKeyframe(null, Timeline.time, "rotation", true);
                    Undo.finishEdit('Add keyframes')
                ;
                }
            });
            add_key_button1 = new Action('add_keyframes_r', {
                name: '全体添加旋转关键帧',
                description: '全部组在时间标处添加旋转关键帧',
                icon: 'icon-keyframe',
                condition:() => Animation.all.length!=0,
                keybind: new Keybind({key: 'r', ctrl: true, alt: true, shift: true}),
                click: function() {
                    //console.log(Animation.all);
                    keyframes=[]
                    Undo.initEdit({keyframes});
                    Group.all.forEach(group => {
                        keyframes.push(Animation.selected.getBoneAnimator(group)
                        .createKeyframe(null, Timeline.time, "rotation", false, false));
                    });
                    //Timeline.selected_animator.createKeyframe(null, Timeline.time, "rotation", true);
                    Undo.finishEdit('Add rotation keyframes')
                ;
                }
            });
            add_key_button2 = new Action('add_keyframes_p', {
                name: '全体添加位置关键帧',
                description: '全部组在时间标处添加位置关键帧',
                icon: 'icon-keyframe',
                condition:() => Animation.all.length!=0,
                keybind: new Keybind({key: 'p', ctrl: true, alt: true, shift: true}),
                click: function() {
                    //console.log(Animation.all);
                    keyframes=[]
                    Undo.initEdit({keyframes});
                    Group.all.forEach(group => {
                        keyframes.push(Animation.selected.getBoneAnimator(group)
                        .createKeyframe(null, Timeline.time, "position", false, false));
                    });
                    //Timeline.selected_animator.createKeyframe(null, Timeline.time, "rotation", true);
                    Undo.finishEdit('Add position keyframes')
                ;
                }
            });
            add_key_button3 = new Action('add_keyframes_s', {
                name: '全体添加缩放关键帧',
                description: '全部组在时间标处添加缩放关键帧',
                icon: 'icon-keyframe',
                condition:() => Animation.all.length!=0,
                keybind: new Keybind({key: 'd', ctrl: true, alt: true, shift: true}),
                click: function() {
                    //console.log(Animation.all);
                    var keyframes=[];
                    Undo.initEdit({keyframes});
                    Group.all.forEach(group => {
                        keyframes.push(Animation.selected.getBoneAnimator(group)
                        .createKeyframe(null, Timeline.time, "scale", false, false));
                    });
                    //Timeline.selected_animator.createKeyframe(null, Timeline.time, "rotation", true);
                    Undo.finishEdit('Add scale keyframes')
                ;
                }
            });

            random_move_button_Dialog = new Dialog({
                id: 'random_move_button_dialog',
                title: tl('随机偏移关键帧'),
                draggable: true,
                form: {
                    rank:   {label: '随机程度', type: 'number', value: 1, step:0.001},
                    type:   {label: '通道', type: 'select', value: 'all_sep', options: {
                        all_sep:"三通道分别",
                        all_link:"三通道绑定",
                        rotation: '旋转',
                        position: '位置',
                        scale: '缩放',
                    }},
                    Is_selected:   {label: '仅选中', type: 'checkbox', value: false},
                },
                onConfirm: function(formData) {
                    var type=formData.type;
                    var rank=formData.rank;
                    var Issel=formData.Is_selected;
                    var anim=Animation.selected;
                    var snap=1/anim.snapping
                    var r = 0;
                    var keyframes=All_keyframes(anim);
                    Undo.initEdit({keyframes: keyframes});
                    Group.all.forEach(group =>{
                        r = type !== "all_sep" ? Divide((Math.random()-0.5)*2*rank,snap) : r;
                        ((type === "all_link" ||  type === "all_sep") ? ["rotation","position","scale"] : [type]).forEach(Eachtype => {
                            r = type === "all_sep" ? Divide((Math.random()-0.5)*2*rank,snap) : r;
                            anim.getBoneAnimator(group)[Eachtype].forEach(K => {
                                if (!Issel || K.selected){
                                    if (K.time+r>=0){
                                        K.time+=r;
                                    }
                                    else{
                                        K.remove();
                                    }
                                }
                            })
                        })
                    });
                    
                    Undo.finishEdit('Random move button');
                    this.hide();
                    Project.undo.undo();
                    Project.undo.redo();
                }
            });

            random_move_button = new Action('random_move_button', {
                name: '随机偏移关键帧',
                description: '随机偏移关键帧',
                icon: 'clear_all',
                condition:() => Animation.all.length!=0,
                click: function() {
                    random_move_button_Dialog.show();
                }
            });

            add_key_Bar={name: '添加关键帧', id: 'add_frames', icon: 'play_arrow', children:[
                'add_keyframes',
                'add_keyframes_r',
                'add_keyframes_p',
                'add_keyframes_s',
                ]},
            MenuBar.menus.keyframe.structure.push(add_key_Bar);
            MenuBar.addAction(random_move_button, 'keyframe');
        },
        onunload() {
            add_key_button.delete();
            add_key_button1.delete();
            add_key_button2.delete();
            add_key_button3.delete();
            random_move_button_Dialog.delete();
            MenuBar.menus.keyframe.structure = MenuBar.menus.keyframe.structure.filter(function (item) {
                return JSON.stringify(item) != JSON.stringify(add_key_Bar);
            });
            random_move_button.delete()
        }
    });

})();