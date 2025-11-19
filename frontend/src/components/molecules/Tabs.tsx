interface TabsProps {
  filtro: string;
  setFiltro: (filtro: string) => void;
}

export default function Tabs({ filtro, setFiltro }: TabsProps) {
  const tabs = ["Aprobados", "Por revisar", "Rechazados", "Deshabilitados"];
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setFiltro(tab)}
          className={`tab ${filtro === tab ? "active" : ""}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
