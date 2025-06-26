
'use client';
import React, { useState } from 'react';
import jsPDF from 'jspdf';

export default function RefObserverTool() {
  const [step, setStep] = useState('menu');
  const [matchType, setMatchType] = useState('');
  const [penalties, setPenalties] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [matchDetails, setMatchDetails] = useState({ date: '', home: '', away: '', referee: '' });
  const [editableReport, setEditableReport] = useState('');
  const [finalReport, setFinalReport] = useState('');
  const [summaryStatus, setSummaryStatus] = useState('');

  const startMatch = () => {
    if (matchType) {
      setStep('log');
    }
  };

  const endMatch = () => setStep('details');

  const saveMatchDetails = () => {
    setStep('summary');
    setSummaryStatus('Summary Report Available');
  };

  const writeFullReport = () => {
    const report = logs.map((log, idx) => `${idx + 1}. ${log}`).join('\n');
    setEditableReport(report);
    setSummaryStatus('Report Written');
  };

  const completeReport = () => setSummaryStatus('Report Completed');

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Referee Observation Report`, 10, 10);
    doc.text(`Date: ${matchDetails.date}`, 10, 20);
    doc.text(`Home Team: ${matchDetails.home}`, 10, 30);
    doc.text(`Away Team: ${matchDetails.away}`, 10, 40);
    doc.text(`Referee: ${matchDetails.referee}`, 10, 50);
    doc.text("Report:", 10, 60);
    const lines = doc.splitTextToSize(editableReport, 180);
    doc.text(lines, 10, 70);
    doc.save(`Ref_Report_${matchDetails.date.replace(/\//g, '-')}.pdf`);
    setFinalReport(editableReport);
  };

  return (
    <div style={{ padding: 20 }}>
      {step === 'menu' && (
        <>
          <h2>Start Match</h2>
          <select onChange={e => setMatchType(e.target.value)}>
            <option value="">Select Match Type</option>
            <option value="no-et">League/Cup No Extra Time</option>
            <option value="et">League/Cup Extra Time</option>
          </select>
          <label>
            <input type="checkbox" checked={penalties} onChange={() => setPenalties(!penalties)} />
            Penalties?
          </label>
          <button onClick={startMatch}>Continue</button>
          <button onClick={() => setStep('howto')}>Observer Guide</button>
        </>
      )}

      {step === 'log' && (
        <>
          <h2>Match Log</h2>
          <textarea placeholder="Enter observation (e.g., H4FT on A5 S)" onBlur={e => setLogs([...logs, e.target.value])} />
          <button onClick={endMatch}>End Match</button>
        </>
      )}

      {step === 'details' && (
        <>
          <h2>Match Details</h2>
          <input placeholder="Date" onChange={e => setMatchDetails({ ...matchDetails, date: e.target.value })} />
          <input placeholder="Home Team" onChange={e => setMatchDetails({ ...matchDetails, home: e.target.value })} />
          <input placeholder="Away Team" onChange={e => setMatchDetails({ ...matchDetails, away: e.target.value })} />
          <input placeholder="Referee Name" onChange={e => setMatchDetails({ ...matchDetails, referee: e.target.value })} />
          <button onClick={saveMatchDetails}>Save and View Summary</button>
        </>
      )}

      {step === 'summary' && (
        <>
          <h2>Match Summary</h2>
          <p>Status: {summaryStatus}</p>
          <ul>
            {logs.map((log, idx) => <li key={idx}>{log}</li>)}
          </ul>
          {summaryStatus === 'Summary Report Available' && (
            <button onClick={writeFullReport}>Write Full Report</button>
          )}
          {summaryStatus === 'Report Written' && (
            <>
              <textarea value={editableReport} onChange={e => setEditableReport(e.target.value)} />
              <button onClick={generatePDF}>Generate Report PDF</button>
              <button onClick={completeReport}>Mark as Completed</button>
            </>
          )}
          {summaryStatus === 'Report Completed' && (
            <pre>{finalReport}</pre>
          )}
        </>
      )}

      {step === 'howto' && (
        <>
          <h2>Observer Guide</h2>
          <ul>
            <li><strong>Start Match:</strong> Choose type, then use HKO or AKO.</li>
            <li><strong>Abbreviations:</strong> H4 = Home Player 4, FT = Foul Tackle, S = Supported, etc.</li>
            <li><strong>Notes:</strong> Type in format like H4FT on A5 S</li>
            <li><strong>End Match:</strong> Type FT then fill in match details.</li>
            <li><strong>Report:</strong> Auto-generated summary, editable, downloadable as PDF.</li>
          </ul>
          <button onClick={() => setStep('menu')}>Back to Menu</button>
        </>
      )}
    </div>
  );
}
