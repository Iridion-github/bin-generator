
import { useState, useRef } from 'react';
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
  const counterRef = useRef(0);
  const [binText, setBinText] = useState<string>('P-1-F-413B283');
  const [binsData, setBinsData] = useState<BinInterface[]>([]);

  const generateId = () => {
    counterRef.current += 1;
    return counterRef.current.toString();
  };

  const getColorClass = (letter: string): string => {
    const upperCasedLetter = letter?.toUpperCase() ?? 'A';
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

  const addBin = (newBin: BinInterface) => {
    setBinsData(prev => [...prev, newBin]);
  };

  const deleteBin = (id: string) => {
    const binsDataUpdated = binsData.filter(elem => elem.id !== id);
    setBinsData(binsDataUpdated);
  };

  const handleDeleteAll = () => {
    setBinsData([]);
  };

  const handleSubmit = () => {
    if (!binText?.length) return;
    const uppercasedCode = binText?.toUpperCase() ?? 'A';
    let codeFragments: string[] = [];
    // Check for "space + alphanumeric"
    if (/\s+[A-Z0-9]/.test(uppercasedCode)) {
      codeFragments = uppercasedCode
        .split(/\s+/)        // split on one or more spaces
        .filter(Boolean);    // remove empty strings
    } else {
      codeFragments = [uppercasedCode];
    }
    codeFragments.forEach(frag => {
      const targetLetter = frag[frag.length - 4];
      const colorClass = getColorClass(targetLetter);
      const binClasses = 'bin-container ' + colorClass;
      const binId = generateId();
      const newBin: BinInterface = {
        id: binId.toString(),
        code: frag,
        classes: binClasses,
      };
      addBin(newBin);
    });
    setBinText('');
  };

  return (
    <div className="App">
      <div className="outer-container">
        <div className='input-row'>
          <InputGroup size="lg">
            <InputGroup.Text id="inputGroup-sizing-lg">Codici</InputGroup.Text>
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
        <div className='delete-all-row'>
          {!!binsData?.length && <Button size='lg' variant='danger' onClick={handleDeleteAll}> Elimina Tutti </Button>}
        </div>
        {binsData.map(elem => {
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
        })}
      </div>
    </div>
  );
}

export default App;

