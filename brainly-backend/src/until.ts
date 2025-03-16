export const random=(len:number)=>{

    const option="dasjkbdksadjasjdnansjndasadgoasodi";
    const length=option.length;
    let result = "";

    for (let i = 0 ; i<length ; i++){
        result +=option[Math.floor(Math.random()*option.length)]
    }

    return result;
}