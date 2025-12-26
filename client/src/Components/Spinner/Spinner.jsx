import { Box } from "@mui/material";
import "./spinner.css"

const LoadingSpinner = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" backgroundColor="transparent">
            <div className="loader"></div>
        </Box>
    )
}

export const LoadingSpinnerSmall = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" backgroundColor="transparent">
            <div className="loader-sm"></div>
        </Box>
    )
}

export default LoadingSpinner;