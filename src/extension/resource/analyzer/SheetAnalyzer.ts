////////////////////////////////////////////////////////////////////////////////////////
////
////  Copyright (c) 2014-2015, Egret Technology Inc.
////  All rights reserved.
////  Redistribution and use in source and binary forms, with or without
////  modification, are permitted provided that the following conditions are met:
////
////     * Redistributions of source code must retain the above copyright
////       notice, this list of conditions and the following disclaimer.
////     * Redistributions in binary form must reproduce the above copyright
////       notice, this list of conditions and the following disclaimer in the
////       documentation and/or other materials provided with the distribution.
////     * Neither the name of the Egret nor the
////       names of its contributors may be used to endorse or promote products
////       derived from this software without specific prior written permission.
////
////  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
////  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
////  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
////  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
////  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
////  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
////  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
////  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
////  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
////  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
////
////////////////////////////////////////////////////////////////////////////////////////


module RES {

    /**
     * SpriteSheet解析器
     * @private
     */
    export class SheetAnalyzer extends BinAnalyzer {

        public constructor() {
            super();
            this.responseType = lark.HttpResponseType.TEXT;
        }

        public getRes(name:string):any {
            var res:any = this.fileDic[name];
            if (!res) {
                res = this.textureMap[name];
            }
            if (!res) {
                var prefix:string = RES.AnalyzerBase.getStringPrefix(name);
                res = this.fileDic[prefix];
                if (res) {
                    var tail:string = RES.AnalyzerBase.getStringTail(name);
                    res = res[tail];
                }
            }
            return res;
        }

        /**
         * 一项加载结束
         */
        public onLoadFinish(event:lark.Event):void {
            var request = event.target;
            var data:any = this.resItemDic[request.$hashCode];
            delete this.resItemDic[request.hashCode];
            var resItem:ResourceItem = data.item;
            var compFunc:Function = data.func;
            resItem.loaded = (event.type == lark.Event.COMPLETE);
            if (resItem.loaded) {
                if (request instanceof lark.HttpRequest) {
                    resItem.loaded = false;
                    var imageUrl:string = this.analyzeConfig(resItem, request.response);
                    if (imageUrl) {
                        this.loadImage(imageUrl, data);
                        this.recycler.push(request);
                        return;
                    }
                }
                else {
                    this.analyzeBitmap(resItem, (<lark.ImageLoader>request).data);
                }
            }
            if (request instanceof lark.HttpRequest) {
                this.recycler.push(request);
            }
            else {
                this.recyclerIamge.push(request);
            }
            compFunc.call(data.thisObject, resItem);
        }

        public sheetMap:any = {};

        private textureMap:any = {};

        /**
         * 解析并缓存加载成功的配置文件
         */
        public analyzeConfig(resItem:ResourceItem, data:string):string {
            var name:string = resItem.name;
            var config:any;
            var imageUrl:string = "";
            try {
                var str:string = <string> data;
                config = JSON.parse(str);
            }
            catch (e) {
                lark.$warn(1017, resItem.url, data);
            }
            if (config) {
                this.sheetMap[name] = config;
                imageUrl = this.getRelativePath(resItem.url, config["file"]);
            }
            return imageUrl;
        }

        /**
         * 解析并缓存加载成功的位图数据
         */
        public analyzeBitmap(resItem:ResourceItem, data:lark.BitmapData):void {
            var name:string = resItem.name;
            if (this.fileDic[name] || !data) {
                return;
            }
            var config:any = this.sheetMap[name];
            delete this.sheetMap[name];
            var targetName:string = resItem.data && resItem.data.subkeys ? "" : name;
            var spriteSheet:any = this.parseSpriteSheet(data, config, targetName);
            this.fileDic[name] = spriteSheet;
        }

        /**
         * 获取相对位置
         */
        public getRelativePath(url:string, file:string):string {
            url = url.split("\\").join("/");
            var index:number = url.lastIndexOf("/");
            if (index != -1) {
                url = url.substring(0, index + 1) + file;
            }
            else {
                url = file;
            }
            return url;
        }

        private parseSpriteSheet(texture:lark.BitmapData, data:any, name:string):any {
            var frames:any = data.frames;
            if (!frames) {
                return null;
            }
            var spriteSheet = {};
            var textureMap:any = this.textureMap;
            for (var subkey in frames) {
                var config:any = frames[subkey];
                var subTexture = new lark.Texture(texture, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
                spriteSheet[subkey] = subTexture;
                if (config["scale9grid"]) {
                    var str:string = config["scale9grid"];
                    var list:Array<string> = str.split(",");
                    texture["scale9Grid"] = new lark.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                }
                if (textureMap[subkey] == null) {
                    textureMap[subkey] = subTexture;
                    if (name) {
                        this.addSubkey(subkey, name);
                    }
                }
            }
            return spriteSheet;
        }

        public destroyRes(name:string):boolean {
            var sheet:any = this.fileDic[name];
            if (sheet) {
                delete this.fileDic[name];
                for (var subkey in sheet) {
                    if (this.textureMap[subkey]) {
                        delete this.textureMap[subkey];
                    }
                }
                return true;
            }
            return false;
        }

        /**
         * ImageLoader对象池
         */
        private recyclerIamge:lark.ImageLoader[] = [];

        private loadImage(url:string, data:any):void {
            var loader = this.getImageLoader();
            this.resItemDic[loader.hashCode] = data;
            loader.load(url);
        }

        private getImageLoader():lark.ImageLoader {
            var loader = this.recyclerIamge.pop();
            if (!loader) {
                loader = new lark.ImageLoader();
                loader.on(lark.Event.COMPLETE, this.onLoadFinish, this);
                loader.on(lark.Event.IO_ERROR, this.onLoadFinish, this);
            }
            return loader;
        }
    }
}
