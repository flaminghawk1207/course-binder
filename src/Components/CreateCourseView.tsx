// takes in channel_name, channel_code, channel_department
import { Typography, Paper, Box } from "@mui/material";

const CreateCourseView = (channel_name:string, channel_code:string, channel_department:string) => {
    return (
        <Box>
                <Typography>Course Code: {channel_code}</Typography>
                <Typography>Course Name: {channel_name}</Typography>
                <Typography>Course Deparment: {channel_department}</Typography>
        </Box>
    );   
}

export default CreateCourseView;