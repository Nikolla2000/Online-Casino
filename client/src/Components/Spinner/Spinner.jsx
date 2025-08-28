import { Box } from "@mui/material";
import "./spinner.css"

const LoadingSpinner = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" backgroundColor="transparent">
            <div className="loader"></div>
        </Box>
    )
}

export default LoadingSpinner;