// var converter = new showdown.Converter({tables: true,extensions: ['prettify']});
// converter.setOption({highlight: function (code) {
//     console.log(hljs.highlightAuto,code);
//     return hljs.highlightAuto(code).value;
// }});
// converter.makeHtml('@glyphicon-envelope');
// converter.makeHtml('@fa-home');
// // var defaultOptions = showdown.getDefaultOptions();
marked.setOptions({
    highlight: function(code) {
        return hljs.highlightAuto(code).value;
    },
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
})
function mdSwitch() {
    that = document.querySelector('#md-area');
    text = that.innerText;
    // html = converter.makeHtml(text);
    html = marked(text);
    document.getElementById("preView").innerHTML = html;
    document.getElementById("mdReader").innerHTML = html;
}
function mdSave(){
    document.getElementById('md-area').innerText = document.getElementById('md-area').innerText
}
window.onkeydown = function (event) {
    if (event.ctrlKey && event.keyCode == 191) {
        // Ctrl + / 
        vue.MainToggle();
    }
    if (event.ctrlKey && event.keyCode == 83) {
        // ctrl + s
        mdSave()
        if(event && event.stopPropagation){
            event.stopPropagation();  //  w3c 标准
            event.preventDefault();
        }else{
            event.cancelBubble = true;  // ie 678  IE浏览器
        }
    }
};
var mdList = [
    // {id:2,title:'333',dir:0,pid:0},
    // {id:3,title:'444',dir:0,pid:0},
    // {id:4,title:'555',dir:0,pid:0},
    // {id:5,title:'666',dir:1,pid:0},
    // {id:6,title:'777',dir:0,pid:0},
    // {id:7,title:'aaa1',dir:1,pid:2},
    // {id:8,title:'aaa2',dir:0,pid:2},
    // {id:9,title:'aaa3',dir:0,pid:2},
    // {id:10,title:'aaa4',dir:1,pid:4},
    // {id:11,title:'aaa5',dir:1,pid:4},
]
for(var i = 0; i< 1000; i++){
    let dir = parseInt(Math.random()*2);
    mdList.push({id:i,title:String.fromCharCode(i)+String.fromCharCode(i**i)+String.fromCharCode(i+i)+i+dir,dir:dir,pid:parseInt(i - (Math.random() * i))},)
}
var vue = new Vue({
    el:"#app",
    data:{
        name:"mdArea",
        txt:'# howdy',
        tab:false, /*@true viewer @false editor */
        floder:{}, // 所有目录内容，undefined的时候会请求接口
        parent:[{id:1,title:'2',dir:1},{id:2,title:'3222',dir:1},{id:3,title:'4443',dir:0}], // 当前展示的父级目录
        son:[{id:4,title:'5',dir:1},{id:5,title:'7888',dir:1},{id:6,title:'9998',dir:0}], // 当前展示的子级目录
        pre_parent:[], // 向右切换的父级目录内容
        pre_son:[], // 用于向右切换的子级目录内容
        hover:[], // 当前选中的目录/文件
        historyl:[],
        historyr:[],
        floder_level:0, // 目录级别，用于左右切换
    },
    methods:{
        createHandler(channel){
            switch(channel){
                case 0:
                    pid = this.hover[this.hover.length - 2];
                    break;
                case 1:
                    pid = this.hover[this.hover.length - 1];
                    break;
            }
        },
        NavClick(channel,key){
            switch (channel){
                case 0:
                    if(0 == this.parent[key].dir){
                        this.getMdInfo(this.parent[key].id,x=>{
                            this.txt = x
                            this.$forceUpdate();
                            if(this.historyl.length){
                                this.son = this.parent;
                                this.parent = this.historyl.pop();
                                this.hover.pop();
                            }
                            this.$nextTick(function(){
                                mdSwitch();
                            })
                        });
                        return true;
                    }
                    // this.hover[0] = this.parent[key];
                    // this.hover[1] = null;
                    this.hover[this.hover.length?this.hover.length-1:0] = this.parent[key].id;
                    this.son = this.getDirNavList(this.parent[key].id)
                    this.$forceUpdate();
                break;
                case 1:
                    if(0 == this.son[key].dir){
                        this.getMdInfo(this.son[key].id,x=>{
                            this.txt = x
                            this.$forceUpdate();
                            this.$nextTick(function(){
                                mdSwitch();
                            })
                        });
                        return true;
                    }
                    this.historyl.push(this.parent)
                    this.parent = this.son;
                    this.son = [];
                    this.hover.push(this.parent[key].id)
                    this.son = this.getDirNavList(this.parent[key].id)
                    console.log(this.historyl);
                    this.$forceUpdate();
                break;
            }
            console.log(this.hover)
        },
        MainToggle(){
            this.tab = !this.tab;
        },
        getDirNavList(pid){
            let res = []
            mdList.forEach(element => {
                if(pid == element.pid){
                    res.push(element);
                }
            });
            return(res)
        },
        getMdInfo(id,fn){
            let res = mdList.find(function(a){
                if(a.id == id)return a;
            });
            fn(`
# 本文章id为：${id}

json格式为：\n
\`\`\`
${JSON.stringify(res,null,4)}
\`\`\`
            
`)
        },
        createFloader(pid){
            
        },
        loadFloader(id){

        },
        addMd(){

        },
        delMd(){

        },
        delFloader(){
            
        },
        initDirNav(){
            let res = this.getDirNavList(0);
            this.parent = res;
            this.son = [];
            this.hover = [];
        }
    },
    created(){
        this.initDirNav()
        this.$nextTick().then(function () {
            document.querySelector('.bg').innerHTML = ''
            mdSwitch()
        })
    }
})