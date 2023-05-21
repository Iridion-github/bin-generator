
import { useState } from 'react';
import './App.css';
import QRCode from "react-qr-code";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';




function App() {
  const [hasGenerated, setHasGenerated] = useState(false);
  const [binText, setBinText] = useState('P-1-F-413B283');

  const getColorClass = (letter: string): string => {
    switch (letter) {
      case 'A': return 'red-bin';
      case 'B': return 'blue-bin';
      case 'C': return 'green-bin';
      case 'D': return 'orange-bin';
      case 'E': return 'grey-bin';
      case 'F': return 'purple-bin';
      default: return 'white-bin';
    }
  };


  const handleChange = (event: any) => {
    setBinText(event.target.value);
  };

  const handleSubmit = () => {
    console.log('submitted this value:', binText);
    setHasGenerated(true);
  };

  const generateBinFragment = () => {
    const targetLetter = binText[binText.length - 4];
    const colorClass = getColorClass(targetLetter);
    const classes = 'bin-container ' + colorClass;
    return (
      <div className={classes}>
        <QRCode value={binText} />
        <div className='bin-text'> {binText}  </div>
        <QRCode value={binText} />
      </div>
    );
  };

  return (
    <div className="App">
      <div className="outer-container">
        <div className='input-row'>
          <InputGroup size="lg">
            <InputGroup.Text id="inputGroup-sizing-lg">Codice</InputGroup.Text>
            <Form.Control
              className='code-input'
              value={binText}
              onChange={handleChange}
              aria-label="Large"
              aria-describedby="codice"
            />
          </InputGroup>
          <Button onClick={handleSubmit}> Genera </Button>
        </div>
        {hasGenerated && generateBinFragment()}
      </div>
    </div>
  );
}

export default App;

