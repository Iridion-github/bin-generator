
import { useState } from 'react';
import './App.css';
import QRCode from "react-qr-code";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


export interface BinInterface {
  id: string;
  code: string;
  classes: string;
}

function App() {
  const [binText, setBinText] = useState('P-1-F-413B283');
  const [binsData, setBinsData] = useState<BinInterface[]>([]);

  const getColorClass = (letter: string): string => {
    const upperCasedLetter = letter.toUpperCase();
    switch (upperCasedLetter) {
      case 'A': return 'green-bin';
      case 'B': return 'purple-bin';
      case 'C': return 'yellow-bin';
      case 'D': return 'azure-bin';
      case 'E': return 'grey-bin';
      case 'F': return 'red-bin';
      default: return 'grey-bin';
    }
  };

  const handleChange = (event: any) => {
    setBinText(event.target.value);
  };

  const deleteBin = (id: string) => {
    const binsDataUpdated = binsData.filter(elem => elem.id !== id);
    setBinsData(binsDataUpdated);
  };

  const handleSubmit = () => {
    const uppercasedCode = binText.toUpperCase();
    const targetLetter = uppercasedCode[uppercasedCode.length - 4];
    const colorClass = getColorClass(targetLetter);
    const binClasses = 'bin-container ' + colorClass;
    const binId = Date.now().toString();
    const newBin: BinInterface = {
      id: binId,
      code: uppercasedCode,
      classes: binClasses,
    };
    const binsDataUpdated = [...binsData, newBin];
    setBinsData(binsDataUpdated);
    setBinText('');
  };


  const generateBinsFromData = () => {
    return binsData.map(elem => {
      return (
        <div id={elem.id} key={elem.id + ' ' + elem.code} className="bin-row">
          <div className={elem.classes}>
            <QRCode size={100} value={elem.code} />
            <div className='bin-text'> {elem.code}  </div>
            <QRCode size={100} value={elem.code} />
          </div>
          <Button size='lg' variant='danger' onClick={() => deleteBin(elem.id)}> Elimina </Button>
        </div>
      );
    });
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
          <Button size='lg' onClick={handleSubmit}> Genera </Button>
        </div>
        {generateBinsFromData()}
      </div>
    </div>
  );
}

export default App;

