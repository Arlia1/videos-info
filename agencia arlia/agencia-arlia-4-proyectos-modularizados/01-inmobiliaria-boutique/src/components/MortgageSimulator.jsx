import React, { useState } from 'react';

export default function MortgageSimulator() {
  const [propertyValue, setPropertyValue] = useState(160000);
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [years, setYears] = useState(20);
  const [annualRate, setAnnualRate] = useState(8.5);

  const loanAmount = propertyValue * (1 - downPaymentPct / 100);
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = years * 12;
  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / totalPayments
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="border border-zinc-800 bg-zinc-900/40 p-8">
        <span className="font-mono text-xs uppercase tracking-widest text-[#C8A97E]">
          Ingeniería Financiera Inmobiliaria
        </span>
        <h2 className="font-serif text-3xl text-white mt-1 mb-6">
          Simulador de Crédito Hipotecario & Financiación Privada
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block font-mono text-xs text-zinc-400 mb-2">
                VALOR DE LA PROPIEDAD (USD): {propertyValue.toLocaleString('es-AR')}
              </label>
              <input
                type="range"
                min="50000"
                max="600000"
                step="5000"
                value={propertyValue}
                onChange={e => setPropertyValue(Number(e.target.value))}
                className="w-full accent-[#C8A97E]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-zinc-400 mb-2">
                ANTICIPO / BOLETO ({downPaymentPct}%): USD {(propertyValue * downPaymentPct / 100).toLocaleString('es-AR')}
              </label>
              <input
                type="range"
                min="10"
                max="70"
                step="5"
                value={downPaymentPct}
                onChange={e => setDownPaymentPct(Number(e.target.value))}
                className="w-full accent-[#C8A97E]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-zinc-400 mb-2">
                PLAZO DE AMORTIZACIÓN: {years} AÑOS ({years * 12} MESES)
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={years}
                onChange={e => setYears(Number(e.target.value))}
                className="w-full accent-[#C8A97E]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-zinc-400 mb-2">
                TASA NOMINAL ANUAL (TNA): {annualRate}%
              </label>
              <input
                type="range"
                min="4.5"
                max="14"
                step="0.5"
                value={annualRate}
                onChange={e => setAnnualRate(Number(e.target.value))}
                className="w-full accent-[#C8A97E]"
              />
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-zinc-500 uppercase">Cuota Mensual Estimada (Sistema Francés)</span>
              <p className="font-mono text-4xl text-[#C8A97E] font-bold mt-2 tabular-nums">
                USD {Math.round(monthlyPayment).toLocaleString('es-AR')}
              </p>
              <div className="mt-6 space-y-2 text-xs font-mono text-zinc-400 border-t border-zinc-800 pt-4">
                <div className="flex justify-between">
                  <span>Capital a Financiar:</span>
                  <span className="text-white">USD {Math.round(loanAmount).toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ingreso Familiar Sugerido (Relación 30%):</span>
                  <span className="text-white">USD {Math.round(monthlyPayment * 3.3).toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 mt-6">
              * Cálculo referencial para líneas bancarias UVA y financiación privada directa con desarrolladora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
