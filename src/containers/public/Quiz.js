import { Questions } from "../../components";
const Quiz = ({isLoggedIn}) => {
    return (
        <div>
            <Questions isLoggedIn={isLoggedIn}/>
        </div>
    )
}
export default Quiz;