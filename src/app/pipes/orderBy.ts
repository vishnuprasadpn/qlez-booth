import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
 transform(array,orderBy,asc=true){
 console.log(array);
 if (!orderBy || orderBy.trim() == ""){
   return array;
 } 
 let temp = [];
 let trim=[];
  //ascending
  if (asc){
     temp = array.sort((item1: any, item2: any) => { 
     let a = item1[orderBy];
     let b = item2[orderBy];
     return this.orderByComparator(a, b);
   });
 }
 else{
   //not asc
   temp = array.sort((item1: any, item2: any) => { 
     let a = item1[orderBy];
     let b = item2[orderBy]; 
     return this.orderByComparator(b, a);
   });
 }
 
   return Array.from(temp);
 
 }
 
  orderByComparator(a:any, b:any):number{
  
  // if((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))){
  //   //Isn't a number so lowercase the string to properly compare
  //   if(a.toLowerCase() < b.toLowerCase()) return -1;
  //   if(a.toLowerCase() > b.toLowerCase()) return 1;
  // }
  // else{
    
    //Parse strings as numbers to compare properly
    if(Date.parse(a) < Date.parse(b)) return -1;
    if(Date.parse(a) > Date.parse(b)) return 1;
  // }

}


 }

