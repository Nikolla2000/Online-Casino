import { Box } from "@mui/material";
import "./spinner.css"

// new component using regular div wrapper instead of mui box
const LoadingSpinner = () => {
    return (
        <div className="loader-wrapper">
            <div className="loader"></div>
        </div>
    )
}

export const LoadingSpinnerSmall = () => {
    return (
        <div className="loader-wrapper">
            <div className="loader-sm"></div>
        </div>
    )
}

// old component using mui box
// const LoadingSpinner = () => {
//     return (
//         <Box display="flex" justifyContent="center" alignItems="center" backgroundColor="transparent">
//             <div className="loader"></div>
//         </Box>
//     )
// }

// export const LoadingSpinnerSmall = () => {
//     return (
//         <Box display="flex" justifyContent="center" alignItems="center" backgroundColor="transparent">
//             <div className="loader-sm"></div>
//         </Box>
//     )
// }


export default LoadingSpinner;