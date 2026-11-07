


import { useApp } from '../../context/AppContext'

const palettes = [
  { id: 'default', name: 'Predeterminada' },
  { id: 'colorblind', name: 'Daltonismo' },
  { id: 'low-vision', name: 'Baja visión (alto contraste)' },
]

export default function AccessibilityToggle() {
  const { accessibility, setPalette } = useApp()

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-4">
      <h2 className="mb-2 font-semibold text-gray-900">
        Accesibilidad visual
      </h2>

      <p className="mb-4 text-sm text-gray-600">
        Selecciona la paleta de colores que prefieras.
      </p>

      <div className="flex flex-col gap-2">
        {palettes.map((palette) => (
          <button
            key={palette.id}
            type="button"
            onClick={() => setPalette(palette.id)}
            aria-pressed={accessibility.palette === palette.id}
            className={`rounded-lg border-2 px-4 py-3 text-left font-medium ${
              accessibility.palette === palette.id
                ? 'border-blue-700 bg-blue-50 text-blue-900'
                : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
            }`}
          >
            {palette.name}
            {accessibility.palette === palette.id && ' ✓'}
          </button>
        ))}
      </div>
    </div>
  )
}












