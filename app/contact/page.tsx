import Button from "./button"

export default async function Contact() {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts")
    const posts = await response.json()
    console.log(posts)
    return (
        <div>
            <h1>The Contact page!</h1>
            <Button />
        </div>
    )
} 
