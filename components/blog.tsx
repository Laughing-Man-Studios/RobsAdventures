import { ModifiedMessage } from "../common/types"
import styles from "../styles/Blog.module.css"

type Blog = {
    messages: ModifiedMessage[]
}
const Blog: React.FC<Blog> = ({ messages }) => {
    return (
        <div className={styles.messageContainer}>
            { messages.map(message => (
                <div key={message.id}>
                    <h3>Date: {message.dateTime}</h3>
                    <p>{message.message}</p>
                </div>

            )) }
        </div>
    )
}

export default Blog;