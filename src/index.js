/**
 * Option tool for editorjs 
 *  @author Upendra Kumar uk2459644
 * @license MIT
 */

/**
 * Toolbox icon
 */
require('./index.css').toString();
import ToolboxIcon from '../asset/icon.svg';
import WithBorderIcon from '../asset/withBorder.svg';
import WithBackgroundIcon from '../asset/withBackground.svg';
import StretchedIcon from '../asset/stretched.svg';
import ImageIcon from '../asset/image.svg';
import MathIcon from '../asset/math.svg';
import AlphaUp from '../asset/alphaUp.svg';
import AlphaDown from '../asset/alphaDown.svg';
import TextIcon from '../asset/simpleText.svg';

const katex=require('katex');

export default class Option {

    static get toolbox (){
        return {
            icon:ToolboxIcon,
            title:'Option',
        }
    }
    static get isReadOnlySupported() {
        return true;
    }
    static get enableLineBreaks() {
        return true;
      }

    constructor({data,api,config,readOnly}){
        this.currentIndex=0;
        this.api=api;
        this.config=config || {};
        this.readOnly=readOnly;
        this.data ={
            option:data.option || 'A',
            type : data.type || 'text',
            text : data.text || '',
            withBorder: data.withBorder !== undefined ? data.withBorder : false,
            withBackground : data.withBackground !== undefined ? data.withBackground : false,
            stretched : data.stretched !== undefined ? data.stretched : false,
            image : data.image !== undefined ? data.image : false,
            math : data.math !== undefined ? data.math : false
        };
        this.wrapper=undefined;
        this.katex=katex;
        this.settings = [
           {
               name:'withBorder',
               icon : WithBorderIcon
           },
           {
               name : 'stretched',
               icon : StretchedIcon
           },
           {
               name : 'withBackground',
               icon : WithBackgroundIcon
           },
           {
               name : 'image',
               icon : ImageIcon
           },
           {
               name : 'math',
               icon : MathIcon
           },
           {
               name : 'alpha-up',
               icon : AlphaUp
           },
           {
               name : 'alpha-down',
               icon : AlphaDown
           },
           {
               name : 'text-up',
               icon : TextIcon
           }
        ];
       
    }

    render(){
        this.wrapper = document.createElement('div');
       
        this.wrapper.classList.add('option-uk');

        if(this.readOnly == true || this.data.text != ''){
            const type=this.data.type;

           if(type == 'image'){
               const image=document.createElement('img');
               image.src=this.data.text;
               const alphac = document.createElement('div');
               alphac.classList.add('circ');
               alphac.innerHTML=this.data.option;
               this.wrapper.appendChild(alphac);
               this.wrapper.appendChild(image);
               return this.wrapper;
              
           } else if(type == 'math'){
            const image=document.createElement('div');
            const url=this.data.text;
            this.katex.render(url,image,{
                throwOnError:false
            });
            const alphac = document.createElement('div');
            alphac.classList.add('circ');
            alphac.innerHTML=this.data.option;
            this.wrapper.appendChild(alphac);
            this.wrapper.appendChild(image);
            return this.wrapper;
           } else{
                    
        const p = document.createElement('div');
        const alphac = document.createElement('div');
        alphac.classList.add('circ');
        alphac.innerHTML=this.data.option;
        const url=this.data.text;

      
        // //image.src =url ;
        // let t = document.createTextNode(url);
        p.innerText=url;
        this.wrapper.appendChild(alphac);
         this.wrapper.appendChild(p);

        return this.wrapper;
           }

          
        }

        const alphac=document.createElement('div');
        alphac.innerHTML=this.data.option;
        alphac.classList.add('circ');

        const input = document.createElement('input');
        
        this.wrapper.appendChild(alphac);
        this.wrapper.appendChild(input);
        input.placeholder = this.config.placeholder || 'Write or paste data here';
        input.value = this.data && this.data.text ? this.data.text : '';

        input.addEventListener('paste',(event)=>{
           this.data.text= event.clipboardData.getData('text');
           console.log(this.data.text);
          });

          input.addEventListener('change',(event)=>{
              this.data.text=event.target.value;
          });

        return this.wrapper;
    }

    // onPaste(event){
    //     const data=event.detail.data;
    //     console.log(event.detail);
    //     this.data.text=data;
    //     console.log(this.data.text);
    // }

    save(){

        return {
            ...this.data
        }
    }

    renderSettings(){
        const wrapper = document.createElement('div');

        this.settings.forEach(tune=>{
          let button=document.createElement('div');

          button.classList.add(this.api.styles.settingsButton);
          button.classList.toggle(this.api.styles.settingsButtonActive,this.data[tune.name]);
          button.innerHTML = tune.icon;
          wrapper.appendChild(button);

          button.addEventListener('click',()=>{
              this._toggleTune(tune.name);
              if(tune.name === 'alpha-up'){
                  this._nextAlphabet();
              }
              if (tune.name === 'alpha-down'){
                  this._prevAlphabet();
              }
              if(tune.name === 'image'){
                  this._createImage();
              }
              if(tune.name === 'math'){
                  this._createMath();
              }
              if(tune.name === 'text-up'){
                  this._createTex();
              }
          })

        });

        return wrapper;
    }

    _toggleTune(tune){
        this.data[tune] = !this.data[tune];
        this._acceptTuneView();
    }
    _acceptTuneView() {
        this.settings.forEach( tune => {
          this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);
    
          if (tune.name === 'stretched') {
            this.api.blocks.stretchBlock(this.api.blocks.getCurrentBlockIndex(), !!this.data.stretched);
          }
        
        });
      }

      _createImage(){
        this.data.type='image';
        const image = document.createElement('img');
        const alphac = document.createElement('div');
        alphac.classList.add('circ');
        alphac.innerHTML=this.data.option;
        const url=this.data.text.trim();
        image.src =url ;
        console.log('hello from image'+url);
        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(alphac);
        this.wrapper.appendChild(image);

        return this.wrapper;
      }
      
      _createMath(){
        this.data.type='math';
        const image = document.createElement('div');
        const alphac = document.createElement('div');
        alphac.classList.add('circ');
        alphac.innerHTML=this.data.option;
        const url=this.data.text.trim();
        //image.src =url ;
        this.katex.render(url,image,{
            throwOnError:false
        });
        console.log('hello from math 23'+url);
        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(alphac);
        this.wrapper.appendChild(image);

        return this.wrapper;
      }

      _createTex(){
      
        this.data.type='text';
      
        const p = document.createElement('div');
        const alphac = document.createElement('div');
        alphac.classList.add('circ');
        alphac.innerHTML=this.data.option;
        const url=this.data.text;

        console.log('hello from text'+url);
       
        // //image.src =url ;
        // let t = document.createTextNode(url);
        p.innerText=url;
        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(alphac);
         this.wrapper.appendChild(p);

        return this.wrapper;

      }

      _nextAlphabet(){
      this.currentIndex=this.currentIndex+1;
      let al=String.fromCharCode(64+this.currentIndex);
      this.data.option=al;
      this.wrapper.innerHTML='';
      this.wrapper.innerHTML=al;
      return this.wrapper;
      }

      _prevAlphabet(){
    this.currentIndex=this.currentIndex-1;
    let al=String.fromCharCode(64+this.currentIndex);
    this.data.option=al;
    this.wrapper.innerHTML='';
    this.wrapper.innerHTML=al;
    return this.wrapper;
    }

}