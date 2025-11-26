
import Sidebar from '../organisms/Sidebar'
import ContInicio from '../organisms/ContInicio'
import Header from '../organisms/Head'
const Inicio = () => {
    return (
        <div className="inicio-page">
            <Header />
            <div className="contnt">
                <Sidebar />
                <ContInicio />
            </div>
        </div>
    )
}

export default Inicio