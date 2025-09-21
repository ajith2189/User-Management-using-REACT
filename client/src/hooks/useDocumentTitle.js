import { useEffect } from "react"
// this is the hook used to make the page as the title for the  page

const useDocumentTitle = (name) => {
    useEffect(() => {
        document.title = name
    },[name])
} 

export default useDocumentTitle;
