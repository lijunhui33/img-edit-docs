<template>
    <div class="edit-container-home">
        <div class="left">
            <!-- <ColorPicker v-model="color1" @on-change="colorChange" alpha />
            <Button @click="isShow = !isShow">隐藏画布</Button>
            <div
                id="editable"
                ref="textArea"
                contenteditable="true"
                @input="demoDivChange"
                style="width: 200px; height: 200px; border: 1px solid red"
            >
              
            </div> -->
            <!-- <button @click="test">测试</button> -->
            <imgEditLeft
                @addText="addText"
                @addImg="addImg"
                @setBgColor="colorChange"
                @addIconImg="addIconImg"
            />
            <!-- <div class="test">文字字体 IMG</div>
            <div class="test2">文字字体</div> -->
        </div>
        <div class="center">
            <div class="canvas">
                <canvasIndex
                    v-if="isShow"
                    ref="canvasIndex"
                    @itemClickHandler="itemClickHandler"
                />
            </div>
        </div>
        <div class="right">
            <Button @click="save">保存</Button>
            <Button @click="editWidth">测试修改画布</Button>
            <imgEditRight
                ref="canvasRight"
                @itemChange="itemChange"
                @setIconColor="setIconColor"
            />
        </div>
        <div class="demos"></div>
    </div>
</template>

<script>
import canvasIndex from "./canvasIndex.vue";
// import imgEditData from "./imgEditData";
import imgEditLeft from "./imgEditLeft.vue";
import imgEditRight from "./ImgEditRight.vue";

export default {
    components: {
        canvasIndex,
        imgEditLeft,
        imgEditRight,
    },
    data() {
        return {
            color1: "rgba(255,255,255,0)",
            isShow: true,
        };
    },
    created() {
        this.errVal = false;
    },
    methods: {
        test() {
            var el = document.getElementById("editable");
            var range = document.createRange();
            var sel = window.getSelection();
            console.log(el.childNodes.length);

            range.setStart(el.childNodes[1], 0);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);
        },
        async demoDivChange() {
            const valArr = [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                0,
                ";",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "0",
            ];
            // const newHtml = oldHtml.replace(/[^\0-9\;]/g, "").split("");
            const html = this.$refs.textArea.innerHTML.replace(/<[^>]+>/g, "");
            if (!html) return;
            const htmlArr = html.split(";");
            let str = "";
            let errorIndex = "";

            if (html.indexOf(";;") != -1) {
                const delByIndex = (s, i) => s.slice(0, i) + s.slice(i + 1);
                this.$refs.textArea.innerHTML = `<span>${delByIndex(
                    html,
                    html.indexOf(";;")
                )}<span>`;
                this.$nextTick(() => {
                    // 光标定位到最后
                    var el = this.$refs.textArea;
                    var range = document.createRange();
                    var sel = window.getSelection();
                    range.setStart(
                        el.childNodes[0],
                        1
                        // el.childNodes[errorIndex].outerText.length
                    );
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                });
                return;
            }

            htmlArr.forEach((element, index) => {
                const elementStrArr = element.split("");
                let flag = false;
                elementStrArr.forEach((item) => {
                    if (valArr.indexOf(item) == -1 && errorIndex == "") {
                        errorIndex = `${index == 0 ? 0 : index + (index - 1)}`;
                    }
                    if (valArr.indexOf(item) == -1) {
                        flag = true;
                    }
                });
                let newElementStr = "";
                if (flag) {
                    newElementStr = element.replace(/[^\0-9\;]/g, "");
                } else {
                    newElementStr = element;
                }
                str +=
                    `<span>${newElementStr}</span>` +
                    `${index + 1 == htmlArr.length ? "" : ";"}`;
            });
            // console.log(str);
            //
            if (errorIndex != "") {
                //
                if (this.timer) {
                    return;
                }
                this.timer = setTimeout(() => {
                    this.$refs.textArea.innerHTML = str;
                    this.timer = null;
                    if (errorIndex) {
                        this.$nextTick(() => {
                            var el = this.$refs.textArea;
                            var range = document.createRange();
                            var sel = window.getSelection();
                            const outerText =
                                el.childNodes[
                                    errorIndex == 0
                                        ? errorIndex
                                        : Number(errorIndex) + 1
                                ].outerText;
                            range.setStart(
                                el.childNodes[
                                    errorIndex == 0
                                        ? errorIndex
                                        : Number(errorIndex) + 1
                                ],
                                outerText.length ? 1 : 0
                            );
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        });
                    }
                }, 200);
            }
        },
        save() {
            this.$refs.canvasIndex.save();
        },
        // 新增文本
        addText() {
            this.$refs.canvasIndex.addText("text");
        },
        // 添加图片
        addImg(src) {
            this.$refs.canvasIndex.addImg(src);
        },
        // 添加图标类图片
        addIconImg(src) {
            this.$refs.canvasIndex.addImg(src, true);
        },
        // 修改宽度
        editWidth() {
            this.$refs.canvasIndex.setDom();
        },
        // 修改背景图片
        colorChange(val) {
            this.$refs.canvasIndex.setBgColor(val);
        },
        // 点击某个图层后修改
        itemClickHandler(val) {
            this.$refs.canvasRight.initData(val);
        },
        // 某个元素进行了宽高等修改
        itemChange(val) {
            this.$refs.canvasIndex.setItemVal(val);
        },
        // 图标类型进行颜色修正 { base64, id  }
        // base64 修改颜色后的图片，、
        // 进行颜色修改id
        setIconColor(obj) {
            console.log(obj);
            this.$refs.canvasIndex.setIconColor(obj);
        },
    },
};
</script>

<style lang="less" scoped>
.edit-container-home {
    display: flex;
    width: 100%;
    // .left {
    //     width: 100px;
    // }
    .center {
        flex: 1;
        min-height: 800px;
        background: rgb(249, 249, 249);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        // .canvas {
        //     background: rgba(0, 0, 0, 0);
        // }
    }
    .right {
        width: 350px;
    }
}
.test {
    // font-size: 20px;
    // font-family: "Courier New", Courier, monospace;
    // font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    // font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
    //     sans-serif;
    // font-family: "Times New Roman", Times, serif;
    // font-family: Arial, Helvetica, sans-serif;
    font-family: "华文细黑";
}
</style>
