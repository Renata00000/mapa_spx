// src/components/MapaBrasil.jsx
import React, { useEffect, useRef, useState } from "react";

// Cores das REGIONAIS da Shopee (não mais regiões geográficas)
const regionalColors = {
  "n-ne": "#75db7e",        // Verde - Norte/Nordeste
  "co-mg": "#e6a65d",       // Laranja - Centro-Oeste/MG
  "rj-es": "#db7575",       // Vermelho/Rosa - RJ/ES
  "sul": "#b875db",         // Roxo - Sul (PR/SC/RS)
  "sp": "#829fee"           // Azul - São Paulo
};

// Mapeamento de cada estado para sua regional da Shopee
const stateToRegional = {
  // N/NE - Norte e Nordeste
  'RO': 'n-ne', 'AC': 'n-ne', 'AM': 'n-ne', 'RR': 'n-ne', 'PA': 'n-ne', 'AP': 'n-ne', 'TO': 'n-ne',
  'MA': 'n-ne', 'PI': 'n-ne', 'CE': 'n-ne', 'RN': 'n-ne', 'PB': 'n-ne', 'PE': 'n-ne', 'AL': 'n-ne', 'SE': 'n-ne', 'BA': 'n-ne',
  // CO/MG - Centro-Oeste e Minas Gerais
  'MT': 'co-mg', 'MS': 'co-mg', 'GO': 'co-mg', 'DF': 'co-mg', 'MG': 'co-mg',
  // RJ/ES - Rio de Janeiro e Espírito Santo
  'RJ': 'rj-es', 'ES': 'rj-es',
  // SUL - Paraná, Santa Catarina e Rio Grande do Sul
  'PR': 'sul', 'SC': 'sul', 'RS': 'sul',
  // SP - São Paulo (separado)
  'SP': 'sp'
};

// Mapeamento de nomes completos para siglas
const nomeParaSigla = {
  'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM', 'Amazonas ': 'AM',
  'Bahia': 'BA', 'Ceará': 'CE', 'Distrito Federal': 'DF', 
  'Espírito Santo': 'ES', 'Espirito Santo': 'ES', 'Espirito Santo ': 'ES',
  'Goiás': 'GO', 'Maranhão': 'MA', 'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS',
  'Minas Gerais': 'MG', 'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR',
  'Pernambuco': 'PE', 'Piauí': 'PI', 'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN',
  'Rio Grande do Sul': 'RS', 'Rondônia': 'RO', 'Rondonia': 'RO', 'Roraima': 'RR',
  'Santa Catarina': 'SC', 'São Paulo': 'SP', 'Sergipe': 'SE', 'Tocantins': 'TO'
};

function hexToRgba(hex, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Função para obter a cor da regional do estado
function getStateRegionalColor(estadoNome) {
  const sigla = nomeParaSigla[estadoNome];
  if (!sigla) return "#cccccc";
  const regional = stateToRegional[sigla];
  return regionalColors[regional] || "#cccccc";
}

export default function MapaBrasil({ onEstadoClick }) {
  const [svgText, setSvgText] = useState(null);
  const containerRef = useRef(null);

  // 1) Carrega o arquivo SVG (public/brasil.svg)
  useEffect(() => {
    fetch("/brasil.svg")
      .then((r) => {
        if (!r.ok) throw new Error("SVG não encontrado em /brasil.svg");
        return r.text();
      })
      .then((text) => {
        // Injetar CSS customizado no SVG para sobrescrever cores
        const cssOverride = `
          <style>
            .tracado-nordeste { stroke: #75db7e !important; }
            .tracado-centro-oeste { stroke: #e6a65d !important; }
            .tracado-sudeste { stroke: #db7575 !important; }
            .tracado-sul { stroke: #b875db !important; }
          </style>
        `;
        
        // Adicionar CSS antes de fechar </defs>
        const modifiedSvg = text.replace('</defs>', cssOverride + '</defs>');
        setSvgText(modifiedSvg);
      })
      .catch((err) => {
        console.error(err);
        setSvgText(
          `<svg><text x="10" y="20">Erro ao carregar /brasil.svg – verifique se o arquivo está em public/brasil.svg</text></svg>`
        );
      });
  }, []);

  // 2) Após o SVG injetado, adiciona listeners e lógica de destaque
  useEffect(() => {
    if (!svgText) return;
    const container = containerRef.current;
    if (!container) return;
    const svgEl = container.querySelector("svg");
    if (!svgEl) return;

    // ATUALIZAR data-regiao de cada estado para a nova regional da Shopee
    const updateRegionAttributes = () => {
      const allPaths = svgEl.querySelectorAll('[data-regiao]');
      allPaths.forEach(path => {
        const g = path.closest('g');
        const textEl = g ? g.querySelector('text') : null;
        const estadoNome = (textEl?.textContent?.trim() || path.getAttribute('data-name') || '').trim();
        
        // Converter nome para sigla e depois para regional
        const sigla = nomeParaSigla[estadoNome];
        const novaRegional = sigla ? stateToRegional[sigla] : null;
        
        if (novaRegional) {
          path.setAttribute('data-regiao', novaRegional);
          // Aplicar cor imediatamente
          const cor = regionalColors[novaRegional] || '#cccccc';
          path.style.fill = cor;
        }
      });
    };

    updateRegionAttributes();

    const states = Array.from(
      svgEl.querySelectorAll(".regiao-estado, [data-regiao]")
    );

    const applyHighlight = (hoveredEl = null) => {
      let hoveredEstadoNome = null;
      let hoveredRegional = null;

      if (hoveredEl) {
        const g = hoveredEl.closest("g");
        const textEl = g ? g.querySelector("text") : null;
        hoveredEstadoNome = textEl?.textContent?.trim() || hoveredEl.getAttribute("data-name");
        const sigla = nomeParaSigla[hoveredEstadoNome];
        hoveredRegional = sigla ? stateToRegional[sigla] : null;
      }

      states.forEach((el) => {
        const g = el.closest("g");
        const textEl = g ? g.querySelector("text") : null;
        const estadoNome = textEl?.textContent?.trim() || el.getAttribute("data-name");
        const sigla = nomeParaSigla[estadoNome];
        const regional = sigla ? stateToRegional[sigla] : null;
        const baseColor = getStateRegionalColor(estadoNome);

        // Estado sendo hovereado (dourado + movimento)
        if (hoveredEl && el === hoveredEl) {
          el.style.fill = "#FFD700";
          el.style.opacity = "1";
          el.style.transform = "scale(1.05)";
          el.style.transformOrigin = "center";
          el.style.filter = "drop-shadow(0px 0px 5px rgba(0,0,0,0.3))";
        } 
        // Estados da mesma regional (destaque)
        else if (hoveredRegional && regional === hoveredRegional) {
          el.style.fill = hexToRgba(baseColor, 1);
          el.style.opacity = "1";
          el.style.transform = "scale(1)";
          el.style.filter = "none";
        } 
        // Outros estados (apagados)
        else {
          el.style.fill = hexToRgba(baseColor, 0.25);
          el.style.opacity = "1";
          el.style.transform = "scale(1)";
          el.style.filter = "none";
        }

        el.style.transition =
          "fill 200ms ease, opacity 200ms ease, transform 200ms ease, filter 200ms ease";
        el.setAttribute("tabindex", "0");
        el.style.cursor = "pointer";
      });
    };

    const clearHighlight = () => {
      states.forEach((el) => {
        // Ao invés de limpar, voltar para a cor da regional
        const g = el.closest('g');
        const textEl = g ? g.querySelector('text') : null;
        const estadoNome = textEl?.textContent?.trim() || el.getAttribute('data-name');
        const baseColor = getStateRegionalColor(estadoNome);
        
        el.style.fill = baseColor;
        el.style.opacity = "1";
        el.style.transform = "scale(1)";
        el.style.filter = "none";
      });
    };

    const handleMouseEnter = (e) => {
      applyHighlight(e.currentTarget);
    };
    const handleMouseLeave = () => {
      clearHighlight();
    };
    const handleClick = (e) => {
      const el = e.currentTarget;
      const g = el.closest("g");
      const textEl = g ? g.querySelector("text") : null;
      const nome =
        (textEl && textEl.textContent && textEl.textContent.trim()) ||
        el.getAttribute("data-name") ||
        "Estado";
      
      // Passar o NOME (OpLogistica vai converter para sigla)
      if (onEstadoClick) onEstadoClick(nome);
      else alert(`Você clicou em ${nome}`);
      // =========================================================
    };

    states.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
      el.addEventListener("click", handleClick);
      el.addEventListener("focus", handleMouseEnter);
      el.addEventListener("blur", handleMouseLeave);
      const keyHandler = (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          handleClick({ currentTarget: el });
        }
      };
      el.addEventListener("keydown", keyHandler);
      el.___mapa_keyHandler = keyHandler;
    });

    // Aplicar cores iniciais logo após carregar
    clearHighlight();

    return () => {
      states.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.removeEventListener("click", handleClick);
        el.removeEventListener("focus", handleMouseEnter);
        el.removeEventListener("blur", handleMouseLeave);
        if (el.___mapa_keyHandler)
          el.removeEventListener("keydown", el.___mapa_keyHandler);
      });
    };
  }, [svgText, onEstadoClick]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "auto", maxWidth: 1070 }}
      dangerouslySetInnerHTML={{ __html: svgText || "<p>Carregando mapa...</p>" }}
    />
  );
}