﻿//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module lark {

    /**
     * @language en_US
     * The SoundChannel class controls a sound in an application.
     * Every sound is assigned to a sound channel, and the application
     * can have multiple sound channels that are mixed together.
     * The SoundChannel class contains a stop() method, properties for
     * set the volume of the channel
     *
     * @event egret.Event.COMPLETE Emit when a sound has finished playing
     * @version Lark 1.0
     * @platform Web,Native
     */
    /**
    * @language zh_CN
     * SoundChannel 类控制应用程序中的声音。每个声音均分配给一个声道，而且应用程序可以具有混合在一起的多个声道。
     * SoundChannel 类包含 stop() 方法、用于设置音量和监视播放进度的属性。
     *
     * @event egret.Event.COMPLETE 音频播放完成时抛出
     * @version Lark 1.0
     * @platform Web,Native
    */
    export interface SoundChannel extends IEventEmitter {

        /**
         * @language en_US
         * The volume, ranging from 0 (silent) to 1 (full volume).
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 音量范围从 0（静音）至 1（最大音量）。
         * @version Lark 1.0
         * @platform Web,Native
         */
        volume: number;

        /**
         * @language en_US
         * [read-only]  When the sound is playing, the position property indicates
         * in seconds the current point that is being played in the sound file.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * [只读] 当播放声音时，position 属性表示声音文件中当前播放的位置（以秒为单位）
         * @version Lark 1.0
         * @platform Web,Native
         */
        position: number;

        /**
         * @language en_US
         * Stops the sound playing in the channel.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 停止在该声道中播放声音。
         * @version Lark 1.0
         * @platform Web,Native
         */
        stop(): void;
    }
}