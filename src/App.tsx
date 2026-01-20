
import { useState, useRef } from 'react';
import './App.css';
import QRCode from "react-qr-code";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const handleDownloadPDF = async (): Promise<void> => {
    const original = document.getElementById("binsContainer") as HTMLDivElement | null;
    if (!original) return;
    const clone = original.cloneNode(true) as HTMLDivElement;
    // Remove delete buttons
    Array.from(clone.children).forEach((binRow: Element) => {
      if (!(binRow instanceof HTMLDivElement)) return;
      Array.from(binRow.children).forEach((child: Element) => {
        if (child instanceof HTMLButtonElement) {
          binRow.removeChild(child);
        }
      });
    });
    // Hidden wrapper
    const wrapper: HTMLDivElement = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "0";
    wrapper.style.width = "800px";
    document.body.appendChild(wrapper);
    wrapper.appendChild(clone);
    const bins: HTMLDivElement[] = Array.from(clone.children).filter(
      (el): el is HTMLDivElement => el instanceof HTMLDivElement
    );
    const binsPerPage = 10;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    for (let i = 0; i < bins.length; i += binsPerPage) {
      const pageContainer: HTMLDivElement = document.createElement("div");
      pageContainer.style.display = "flex";
      pageContainer.style.flexDirection = "column";
      bins.slice(i, i + binsPerPage).forEach((bin: HTMLDivElement) => {
        pageContainer.appendChild(bin.cloneNode(true));
      });
      wrapper.appendChild(pageContainer);
      const canvas: HTMLCanvasElement = await html2canvas(pageContainer, {
        scale: 2,
        useCORS: true,
      });
      const imgData: string = canvas.toDataURL("image/png");
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;
      // Convert px → mm proportionally
      const imgWidthMm = pageWidth - margin * 2;
      const imgHeightMm = (imgHeightPx * imgWidthMm) / imgWidthPx;
      const scale = Math.min(
        imgWidthMm / imgWidthMm,
        (pageHeight - margin * 2) / imgHeightMm
      );
      const finalWidth = imgWidthMm * scale;
      const finalHeight = imgHeightMm * scale;
      if (i !== 0) pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        margin,
        finalWidth,
        finalHeight
      );
      wrapper.removeChild(pageContainer);
    }
    pdf.save("bins.pdf");
    document.body.removeChild(wrapper);
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
        <div className='action-btns-row'>
          {!!binsData?.length && <Button size='lg' variant='danger' onClick={handleDeleteAll} style={{ marginRight: 4 }}> Elimina Tutti </Button>}
          {!!binsData?.length && <Button size='lg' variant='success' onClick={handleDownloadPDF}> Download PDF </Button>}
        </div>

        {!!binsData?.length && <div id='binsContainer'>
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
        </div>}
      </div>
    </div>
  );
}

export default App;

