interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Buscar usuario..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
