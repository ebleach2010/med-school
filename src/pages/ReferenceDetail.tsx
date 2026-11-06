import { Link, useParams } from "react-router-dom";
import { ANTIBODY_BY_ID, INVESTIGATION_BY_ID } from "../lib/content";
import { ProvenanceLine } from "../components/Provenance";
import { Icon } from "../components/Icon";

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <tr>
      <th style={{ width: "30%" }}>{label}</th>
      <td>{value}</td>
    </tr>
  );
}

export function AntibodyDetail() {
  const { id } = useParams();
  const a = ANTIBODY_BY_ID.get(id ?? "");
  if (!a) return <p>Not found.</p>;
  return (
    <div className="stack">
      <Link to="/reference?tab=antibodies" className="crumb">
        <Icon name="back" /> Antibodies
      </Link>
      <h1>{a.name}</h1>
      <div className="row">
        <span className={`badge ${a.evidence === "established" ? "green" : a.evidence === "probable" ? "blue" : "amber"}`}>Evidence: {a.evidence}</span>
        <span className="badge gray">{a.availability.replace("-", " ")}</span>
        <span className="badge gray">{a.category.replace("-", " ")}</span>
      </div>
      {a.aliases.length > 0 && <p className="small muted">Also: {a.aliases.join(", ")}</p>}
      <div className="card">
        <table className="data">
          <tbody>
            <Row label="Target" value={a.target} />
            <Row label="Phenotypes" value={a.phenotypes.join("; ")} />
            <Row label="Typical presentation" value={a.typical} />
            <Row label="Unusual presentations" value={a.unusual} />
            <Row label="Examination" value={a.findings.exam} />
            <Row label="MRI" value={a.findings.mri} />
            <Row label="EEG" value={a.findings.eeg} />
            <Row label="CSF" value={a.findings.csf} />
            <Row label="Preferred specimen" value={a.specimen} />
            <Row label="Testing method" value={a.method} />
            <Row label="Titer interpretation" value={a.titerInterpretation} />
            <Row label="False positives" value={a.falsePositive} />
            <Row label="False negatives" value={a.falseNegative} />
            <Row label="Specificity and limitations" value={a.specificity} />
            <Row label="Cancer association and evaluation" value={a.cancer} />
          </tbody>
        </table>
      </div>
      <ProvenanceLine meta={a.meta} />
    </div>
  );
}

export function InvestigationDetail() {
  const { id } = useParams();
  const i = INVESTIGATION_BY_ID.get(id ?? "");
  if (!i) return <p>Not found.</p>;
  return (
    <div className="stack">
      <Link to="/reference?tab=investigations" className="crumb">
        <Icon name="back" /> Tests
      </Link>
      <h1>{i.name}</h1>
      <div className="row">
        <span className="badge gray">{i.category}</span>
        <span className="badge gray">Typical turnaround {i.turnaroundNote}</span>
        <span className="badge gray">Cost {"$".repeat(i.cost)}</span>
      </div>
      <div className="card">
        <table className="data">
          <tbody>
            <Row label="Question it answers" value={i.question} />
            <Row label="When indicated" value={i.indications} />
            <Row label="Urgency" value={i.urgency} />
            <Row label="Specimen or protocol" value={i.specimen} />
            <Row label="Included tests" value={i.bundle?.join(", ")} />
            <Row label="Contraindications and limitations" value={i.limitations} />
            <Row label="A positive or abnormal result" value={i.positiveMeans} />
            <Row label="A negative or normal result" value={i.negativeMeans} />
            <Row label="What happens next" value={i.next} />
            <Row label="Laboratory variation" value={i.labVariation} />
          </tbody>
        </table>
      </div>
      {i.analytes && i.analytes.length > 0 && (
        <div className="card">
          <h2>Typical reference ranges</h2>
          <table className="data">
            <thead>
              <tr>
                <th>Analyte</th>
                <th>Range</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {i.analytes.map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>{a.refRange}</td>
                  <td>{a.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="tiny muted">Ranges vary by laboratory, method, age, and sex. Use the reporting laboratory's range.</p>
        </div>
      )}
      <ProvenanceLine meta={i.meta} />
    </div>
  );
}
