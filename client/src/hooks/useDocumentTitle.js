import { useEffect } from "react"

const useDocumentTitle = (name) => {
    useEffect(() => {
        document.title = name
    },[name])
} 

export default useDocumentTitle;