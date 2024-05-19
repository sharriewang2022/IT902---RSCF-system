import {useEffect,useState} from "react";


function getSavedValue(key: string, initialValue: any){
    // localStorage.getItem(key) may be null, so connect "'null'"
    const savedValue = JSON.parse(localStorage.getItem(key) || 'null')
    // localStorage.getItem(key) may be '', so connect "'{}'"
    // const savedValue = JSON.parse(localStorage.getItem(key) || '{}')
    if(savedValue) return savedValue    
    
    if( initialValue instanceof Function) return initialValue()

    return initialValue
}

export function useLocalStorage(key: string , initialValue: any){

    const [value,setValue] = useState(() =>{
        return getSavedValue(key,initialValue)
    })

    useEffect(() => {
        localStorage.setItem(key,JSON.stringify(value))
    },[value])

    return [value,setValue]
}