import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { createStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Input, InputBase } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SolrNode from 'solr-node';
import WebPlayback from './OWebPlayback'

const solrClient = new SolrNode({
  host: 'localhost',
  port: '8983',
  core: 'comp631',
  protocol: 'http'
});

const myStyle = {
  width: '100%',
  height: '113px',
  fontSize: '16px',
  color: '#170f4f',
  padding: '10px',
};
const theme = createTheme({
  typography: {
    fontFamily:'cursive',
  },
});
export default function MainPage(props) {
  console.log(props.token);
  const [data, setData] = useState();
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const searchTerm = formData.get('searchTerm');
    const regex = /\(([^)]+)\)/g;//括號的正則表達
    const modifiedSearchTerm = searchTerm.replace(regex, (match, p1) => {//把括號裏的文字都轉爲在後面加0.6
    const words = p1.split(' ');
    const modifiedWords = words.map(word => `${word}^0.6`);
    return `(${modifiedWords.join(' ')})`;
  });
    solrClient.search(`q=${modifiedSearchTerm}`, (err, result) => {//從solr獲取前十個結果
      if (err) {
        console.log(err);
        return;
      }
      const jsonData = result.response.docs.map(obj => obj._src_);//把結果轉成jsonData格式便於閲讀
      const output = [];
      const idSet = {};
      for (let i = 0; i < jsonData.length; i++) {//把重複的音樂刪掉
        const id = JSON.parse(jsonData[i]).add.doc.id;
        if (idSet[id]) {
          continue;
        }
        idSet[id] = true; // 将该id标记为已出现过
        output.push({ id: id});
      }
      console.log(output);
      setData(output);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'row',
        }}>
        <CssBaseline />
        <Box
          sx={{
            width: '70%',
            height: '100vh',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // justifyContent: 'space-between', 
            // my: 2
          }}>
          <Box  sx={{overflowY: 'auto'}}>

              <WebPlayback token={props.token} data = {data}></WebPlayback>

          </Box>
        </Box>
        <Box
          sx={{
            width: '30%',
            height: '100vh',
            // justifyContent: 'center',
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 

          }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Case 1: Search relevant songs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Simply text in the lyrics in the textfield.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Case 2: Wrong words</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The application can recognize the words with mistaken spells.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Case 3: Only remember partial word</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                You can use "*" as a placeholder to replace the part of the word you can't remember clearly.
                <br></br>
                E.g. "char*", "*tiple".
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Case 4: Potential included lyrics</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                If you don't sure if a part of lyrics is included in the song you would like to find, you can enclosed the lyrics in parentheses ().
                <br></br>
                E.g. "I'm gonna take my horse to the old town road, (We gonna leave no Sign)."
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Case 5: Different application scenarios</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Scenario 1: Find songs based on lyrics.
                <br></br>
                Scenario 2: Music Player, you needn't download spotify, to get the songs share by other spotify users.
                <br></br>
                Scenario 3: Match songs to diary.
                <br></br> 
                Scenario 4: Match songs based on prompts.                               
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Typography component="h1" variant="h5" sx={{ color: '#235299', htmlFontSize : 13, mt: 3, mb: 2 }}>
            Search Lyrics
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '95%', mt: 1 }}>
            <textarea
              style = {myStyle}
              id="searchTerm"
              label="Input Lyrics"
              name="searchTerm"
              placeholder = "Input your lyrics here."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
