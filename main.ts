// Tiny stack VM for make.fun's tiny-stack-vm ISA (kit: generator/subject/ISA.md).
// One run answers every instance under /input/<id>/ (program.bin + input.bin)
// as /output/<id>/stdout.bin + exit.txt. Node 22, stdlib only.
import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
function run(P,B){
 const n=P.length,S=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=[];
 let s=0,c=0,p=0,t=0,x=0;
 const T=e=>[o,e];
 for(;;){
  if(t===1e6)return T(10);
  if(x<0||x>=n)return T(9);
  const k=P[x];let m=0,u=0,w=0;
  switch(k){
   case 0:case 52:break;
   case 1:m=1;w=1;break;
   case 2:m=4;w=1;break;
   case 3:u=1;break;
   case 4:u=1;w=2;break;
   case 5:u=2;w=2;break;
   case 6:u=2;w=3;break;
   case 7:u=3;w=3;break;
   case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:
   case 28:case 29:case 30:case 32:case 33:case 34:u=2;w=1;break;
   case 23:case 27:u=1;w=1;break;
   case 48:m=2;break;
   case 49:case 50:m=2;u=1;break;
   case 51:m=2;break;
   case 64:u=1;w=1;break;
   case 65:u=2;break;
   case 80:case 81:u=1;break;
   case 82:w=1;break;
   case 83:u=1;break;
   default:return T(5);
  }
  if(x+m>=n)return T(9);
  t++;
  if(s<u)return T(2);
  if(s-u+w>256)return T(3);
  const y=x+1+m;x=y;
  switch(k){
   case 0:return[o,0];
   case 1:S[s++]=P[y-1]<<24>>24;break;
   case 2:S[s++]=P[y-4]|P[y-3]<<8|P[y-2]<<16|P[y-1]<<24;break;
   case 3:s--;break;
   case 4:S[s]=S[s-1];s++;break;
   case 5:{const z=S[s-1];S[s-1]=S[s-2];S[s-2]=z;break}
   case 6:S[s]=S[s-2];s++;break;
   case 7:{const a=S[s-3];S[s-3]=S[s-2];S[s-2]=S[s-1];S[s-1]=a;break}
   case 23:S[s-1]=-S[s-1]|0;break;
   case 27:S[s-1]=~S[s-1];break;
   case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:
   case 28:case 29:case 30:case 32:case 33:case 34:{
    const b=S[s-1],a=S[s-2];let r=0;
    switch(k){
     case 16:r=a+b|0;break;
     case 17:r=a-b|0;break;
     case 18:r=Math.imul(a,b);break;
     case 19:if(b===0)return T(4);r=a===-2147483648&&b===-1?a:(a/b)|0;break;
     case 20:if(b===0)return T(4);r=b===-1?0:a%b|0;break;
     case 21:if(b===0)return T(4);r=Math.floor((a>>>0)/(b>>>0))|0;break;
     case 22:if(b===0)return T(4);r=(a>>>0)%(b>>>0)|0;break;
     case 24:r=a&b;break;
     case 25:r=a|b;break;
     case 26:r=a^b;break;
     case 28:r=a<<(b&31);break;
     case 29:r=a>>(b&31);break;
     case 30:r=(a>>>(b&31))|0;break;
     case 32:r=a===b?1:0;break;
     case 33:r=a<b?1:0;break;
     case 34:r=a>>>0<b>>>0?1:0;break;
    }
    s-=2;S[s++]=r;break;
   }
   case 48:case 49:case 50:{
    const q=(P[y-2]|P[y-1]<<8)<<16>>16;
    let f=k===48;
    if(k!==48){const v=S[--s];f=k===49?v===0:v!==0}
    if(f)x=y+q;break;
   }
   case 51:if(c===64)return T(7);C[c++]=y;x=P[y-2]|P[y-1]<<8;break;
   case 52:if(c===0)return T(8);x=C[--c];break;
   case 64:{const a=S[s-1];if(a<0||a>255)return T(6);S[s-1]=M[a];break}
   case 65:{const a=S[s-1],v=S[s-2];if(a<0||a>255)return T(6);s-=2;M[a]=v;break}
   case 80:{const g=String(S[s-1]);if(o.length+g.length>65536)return T(11);s--;for(let i=0;i<g.length;i++)o.push(g.charCodeAt(i));break}
   case 81:if(o.length+1>65536)return T(11);o.push(S[--s]&255);break;
   case 82:S[s++]=p<B.length?B[p++]:-1;break;
   case 83:return[o,S[--s]&255];
  }
 }
}
for(const id of readdirSync(I).sort()){
 const[o,e]=run(readFileSync(join(I,id,'program.bin')),readFileSync(join(I,id,'input.bin')));
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),Buffer.from(o));
 writeFileSync(join(O,id,'exit.txt'),e+'\n');
}
