import { twMerge } from "tailwind-merge"


export const rc = (mobile:string,md?:string,lg?:string)=>mobile+" "+(md ? concatSize('md',md) : '')+" "+(lg ? concatSize('lg',lg):'')



const concatSize=(size:string,classes:string)=>  classes.split(" ").map(c=>`${size}:${c}`).join(' ')
