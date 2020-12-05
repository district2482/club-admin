import Survey from "material-survey/components/Survey"
import Box from '@material-ui/core/Box';

const VotingPollSurvey = () => {
    return (
        <Box display="flex" p={1} bgcolor="background.paper">
            <Survey
                completeText='Завърши'
                onFinish={answers => {
                    // Do something with the answers
                    console.log(answers)
                }}
                form={{
                    questions: [
                        {
                            name: "1",
                            title: "Избор на президент номини 2022/2023",
                            type: "checkbox",
                            choices: ["Валентин Михайлов"]
                        },
                        {
                            name: "2",
                            title: "Избор на борд 2021/2022",
                            type: "checkbox",
                            choices: ["Валентин Михайлов", "Мартина Маринова", "Нестор Несторов"]
                        },
                    ]
                }}
            />
        </Box>

    );
}

export default VotingPollSurvey;