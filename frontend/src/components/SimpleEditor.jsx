import { useRef, useEffect, useState } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Image, Upload, Undo, Redo,
  Minus, Quote, Eraser, Palette, Highlighter,
  Plus, Trash2
} from 'lucide-react';

export default function SimpleEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [toolbarCoords, setToolbarCoords] = useState({ top: 0, left: 0 });
  const [imgCoords, setImgCoords] = useState(null);

  // Inicializar y sincronizar valor
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const triggerChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    triggerChange();
  };

  // Actualizar coordenadas de la imagen seleccionada y del toolbar flotante
  const updateImgCoords = () => {
    if (!selectedImage || !containerRef.current) {
      setImgCoords(null);
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = selectedImage.getBoundingClientRect();

    const top = imgRect.top - containerRect.top;
    const left = imgRect.left - containerRect.left;
    const width = imgRect.width;
    const height = imgRect.height;

    setImgCoords({ top, left, width, height });

    // Colocar la barra de herramientas flotante justo encima de la imagen, centrada
    const toolbarTop = Math.max(10, top - 55); // Espacio para que quepa arriba
    const toolbarLeft = Math.max(10, left + (width / 2) - 170); // Centrar
    setToolbarCoords({ top: toolbarTop, left: toolbarLeft });
  };

  // Efecto para sincronizar eventos al tener una imagen seleccionada (scroll, resize del window y MutationObserver)
  useEffect(() => {
    if (!selectedImage) return;

    updateImgCoords();

    const handleScrollResize = () => {
      updateImgCoords();
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('scroll', handleScrollResize);
    }
    window.addEventListener('resize', handleScrollResize);

    const observer = new MutationObserver(handleScrollResize);
    observer.observe(selectedImage, { attributes: true, attributeFilter: ['style', 'class'] });

    return () => {
      if (editor) {
        editor.removeEventListener('scroll', handleScrollResize);
      }
      window.removeEventListener('resize', handleScrollResize);
      observer.disconnect();
    };
  }, [selectedImage]);

  // Click fuera de la imagen para deseleccionar
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.closest('.image-toolbar') || e.target.closest('.image-resize-handle')) {
        return;
      }
      if (selectedImage && e.target !== selectedImage) {
        selectedImage.classList.remove('selected-img-active');
        setSelectedImage(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [selectedImage]);

  // Manejo de redimensionado proporcional arrastrando esquinas
  const startResize = (e, corner) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = selectedImage.clientWidth;
    const startHeight = selectedImage.clientHeight;
    const aspectRatio = startWidth / startHeight;

    const handleMouseMove = (moveEvent) => {
      let deltaX = moveEvent.clientX - startX;
      let newWidth = startWidth;

      if (corner === 'br' || corner === 'tr') {
        newWidth = startWidth + deltaX;
      } else if (corner === 'bl' || corner === 'tl') {
        newWidth = startWidth - deltaX;
      }

      if (newWidth < 50) newWidth = 50;

      // Mantener la proporción
      const newHeight = newWidth / aspectRatio;

      // Calcular porcentaje respecto al editor actual para mantener la responsividad
      if (editorRef.current) {
        const editorWidth = editorRef.current.clientWidth - 48; // restar padding aproximado
        const percent = Math.min(100, Math.max(10, Math.round((newWidth / editorWidth) * 100)));
        selectedImage.style.width = `${percent}%`;
        selectedImage.style.height = 'auto';
      } else {
        selectedImage.style.width = `${newWidth}px`;
        selectedImage.style.height = 'auto';
      }

      updateImgCoords();
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      triggerChange();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const addImageUrl = () => {
    const url = prompt('Introduce la URL de la imagen (ej: https://...):');
    if (url) {
      exec('insertImage', url);
      // Pequeño retardo para dar clase a la imagen recién creada si es necesario
      setTimeout(() => {
        if (editorRef.current) {
          const imgs = editorRef.current.getElementsByTagName('img');
          for (let img of imgs) {
            if (img.src === url && !img.style.width) {
              img.style.width = '50%';
              img.style.height = 'auto';
              img.style.display = 'block';
              img.style.margin = '1rem auto';
            }
          }
          triggerChange();
        }
      }, 100);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLocalImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño de archivo (limite a 3MB)
      if (file.size > 3 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Elige una menor a 3MB para mantener la plataforma ágil.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        exec('insertImage', base64);
        
        // Asignar tamaño y estilo predeterminado del procesador de texto (50%, centrado)
        setTimeout(() => {
          if (editorRef.current) {
            const imgs = editorRef.current.getElementsByTagName('img');
            for (let img of imgs) {
              if (img.src === base64 && !img.style.width) {
                img.style.width = '50%';
                img.style.height = 'auto';
                img.style.display = 'block';
                img.style.margin = '1rem auto';
                img.style.borderRadius = '12px'; // Redondeado premium predeterminado
              }
            }
            triggerChange();
          }
        }, 100);
      };
      reader.readAsDataURL(file);
    }
    // Limpiar input de archivo
    e.target.value = '';
  };

  const handleInput = (e) => {
    triggerChange();
  };

  // Manejo de clic en imágenes del editor
  const handleEditorClick = (e) => {
    if (e.target.tagName === 'IMG') {
      e.stopPropagation();
      // Quitar clase activa de la imagen anterior
      if (selectedImage && selectedImage !== e.target) {
        selectedImage.classList.remove('selected-img-active');
      }
      setSelectedImage(e.target);
      e.target.classList.add('selected-img-active');
    } else {
      if (selectedImage) {
        selectedImage.classList.remove('selected-img-active');
      }
      setSelectedImage(null);
    }
  };

  // Métodos de ajuste para la imagen seleccionada (Ajustes estilo Word)
  const adjustSize = (deltaPercent) => {
    if (!selectedImage) return;
    const currentWidth = selectedImage.style.width || '100%';
    let newWidth = '100%';
    
    if (currentWidth.includes('%')) {
      const val = parseInt(currentWidth);
      newWidth = `${Math.min(100, Math.max(10, val + deltaPercent))}%`;
    } else if (currentWidth.includes('px')) {
      const val = parseInt(currentWidth);
      newWidth = `${Math.max(50, val + deltaPercent * 10)}px`;
    } else {
      newWidth = '50%';
    }
    
    selectedImage.style.width = newWidth;
    selectedImage.style.height = 'auto';
    triggerChange();
  };

  const setWidthPreset = (preset) => {
    if (!selectedImage) return;
    selectedImage.style.width = preset;
    selectedImage.style.height = 'auto';
    triggerChange();
  };

  const alignImg = (alignment) => {
    if (!selectedImage) return;
    if (alignment === 'left') {
      selectedImage.style.float = 'left';
      selectedImage.style.margin = '0.5rem 1.5rem 0.5rem 0';
      selectedImage.style.display = 'inline-block';
    } else if (alignment === 'right') {
      selectedImage.style.float = 'right';
      selectedImage.style.margin = '0.5rem 0 0.5rem 1.5rem';
      selectedImage.style.display = 'inline-block';
    } else { // center
      selectedImage.style.float = 'none';
      selectedImage.style.margin = '1rem auto';
      selectedImage.style.display = 'block';
    }
    triggerChange();
  };

  const toggleEffect = (effect) => {
    if (!selectedImage) return;
    if (effect === 'rounded') {
      selectedImage.style.borderRadius = selectedImage.style.borderRadius === '12px' ? '0px' : '12px';
    } else if (effect === 'shadow') {
      selectedImage.style.boxShadow = selectedImage.style.boxShadow ? '' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    } else if (effect === 'border') {
      selectedImage.style.border = selectedImage.style.border ? '' : '3px solid #e2e8f0';
    }
    triggerChange();
  };

  const deleteImg = () => {
    if (!selectedImage) return;
    selectedImage.remove();
    setSelectedImage(null);
    triggerChange();
  };

  const colors = [
    { name: 'Negro', value: '#000000' },
    { name: 'Gris', value: '#64748b' },
    { name: 'Rojo', value: '#ef4444' },
    { name: 'Naranja', value: '#f97316' },
    { name: 'Verde', value: '#10b981' },
    { name: 'Azul', value: '#0ea5e9' },
    { name: 'Morado', value: '#8b5cf6' },
    { name: 'Rosa', value: '#ec4899' }
  ];

  const highlights = [
    { name: 'Sin Resaltado', value: 'transparent' },
    { name: 'Amarillo', value: '#fef08a' },
    { name: 'Verde Claro', value: '#bbf7d0' },
    { name: 'Azul Claro', value: '#bae6fd' },
    { name: 'Rosa Claro', value: '#fbcfe8' }
  ];

  return (
    <div ref={containerRef} className="relative border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500">
      
      {/* Hidden File Input for explorer images */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleLocalImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Microsoft Word styled Toolbar */}
      <div className="flex flex-wrap gap-y-1.5 gap-x-1 p-2 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 select-none">
        
        {/* Fuente & Tamaño */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
          <select 
            onChange={(e) => exec('fontName', e.target.value)} 
            className="text-xs bg-transparent dark:text-white focus:outline-none cursor-pointer pr-1 font-medium"
            title="Tipo de letra"
            defaultValue="Arial"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
          </select>

          <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 mx-1"></div>

          <select 
            onChange={(e) => exec('fontSize', e.target.value)} 
            className="text-xs bg-transparent dark:text-white focus:outline-none cursor-pointer font-medium"
            title="Tamaño de fuente"
            defaultValue="3"
          >
            <option value="1">10px</option>
            <option value="2">12px</option>
            <option value="3">14px</option>
            <option value="4">16px</option>
            <option value="5">18px</option>
            <option value="6">24px</option>
            <option value="7">32px</option>
          </select>
        </div>

        {/* Encabezados */}
        <div className="flex items-center bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
          <select 
            onChange={(e) => exec('formatBlock', e.target.value)} 
            className="text-xs bg-transparent dark:text-white focus:outline-none cursor-pointer font-semibold pr-1"
            title="Estilos de Párrafo"
            defaultValue="<p>"
          >
            <option value="<p>">Párrafo (Normal)</option>
            <option value="<h1>">Título 1 (Grande)</option>
            <option value="<h2>">Título 2 (Medio)</option>
            <option value="<h3>">Título 3 (Pequeño)</option>
            <option value="<blockquote>">Cita Destacada</option>
          </select>
        </div>

        {/* Formateo de Texto */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
          <button type="button" onClick={() => exec('bold')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 transition-colors" title="Negrita (Ctrl+B)"><Bold size={14} /></button>
          <button type="button" onClick={() => exec('italic')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 transition-colors" title="Cursiva (Ctrl+I)"><Italic size={14} /></button>
          <button type="button" onClick={() => exec('underline')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 transition-colors" title="Subrayado (Ctrl+U)"><Underline size={14} /></button>
          <button type="button" onClick={() => exec('strikeThrough')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 transition-colors" title="Tachado"><Strikethrough size={14} /></button>
        </div>

        {/* Colores */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
          {/* Color del texto */}
          <div className="flex items-center gap-0.5" title="Color del Texto">
            <Palette size={12} className="text-slate-400" />
            <select 
              onChange={(e) => exec('foreColor', e.target.value)} 
              className="text-[10px] bg-transparent dark:text-white focus:outline-none cursor-pointer font-medium"
              defaultValue="#000000"
            >
              {colors.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
            </select>
          </div>

          <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 mx-0.5"></div>

          {/* Resaltado */}
          <div className="flex items-center gap-0.5" title="Color de Resaltado">
            <Highlighter size={12} className="text-slate-400" />
            <select 
              onChange={(e) => exec('hiliteColor', e.target.value)} 
              className="text-[10px] bg-transparent dark:text-white focus:outline-none cursor-pointer font-medium"
              defaultValue="transparent"
            >
              {highlights.map(h => <option key={h.value} value={h.value}>{h.name}</option>)}
            </select>
          </div>
        </div>

        {/* Alineación */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
          <button type="button" onClick={() => exec('justifyLeft')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 transition-colors" title="Alinear a la Izquierda"><AlignLeft size={14} /></button>
          <button type="button" onClick={() => exec('justifyCenter')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 transition-colors" title="Centrar"><AlignCenter size={14} /></button>
          <button type="button" onClick={() => exec('justifyRight')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 transition-colors" title="Alinear a la Derecha"><AlignRight size={14} /></button>
          <button type="button" onClick={() => exec('justifyFull')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 transition-colors" title="Justificar"><AlignJustify size={14} /></button>
        </div>

        {/* Listas & Estilos especiales */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
          <button type="button" onClick={() => exec('insertUnorderedList')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 transition-colors" title="Lista con Viñetas (Puntos Negros)"><List size={14} /></button>
          <button type="button" onClick={() => exec('insertOrderedList')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 transition-colors" title="Lista Numerada"><ListOrdered size={14} /></button>
          <button type="button" onClick={() => exec('formatBlock', '<blockquote>')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 transition-colors" title="Insertar Cita"><Quote size={14} /></button>
          <button type="button" onClick={() => exec('insertHorizontalRule')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 transition-colors" title="Línea Divisoria"><Minus size={14} /></button>
        </div>

        {/* Insertar Imágenes */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
          <button 
            type="button" 
            onClick={triggerFileInput} 
            className="p-1 px-2 bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/30 rounded font-bold text-xs flex items-center gap-1 transition-all animate-pulse-glow" 
            title="Subir imagen local desde tu explorador de archivos"
          >
            <Upload size={14} />
            <span>Subir Imagen</span>
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 my-0.5"></div>
          <button type="button" onClick={addImageUrl} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 transition-colors" title="Insertar Imagen por URL"><Image size={14} /></button>
        </div>

        {/* Historial & Borrado */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs ml-auto">
          <button type="button" onClick={() => exec('undo')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 transition-colors" title="Deshacer (Ctrl+Z)"><Undo size={14} /></button>
          <button type="button" onClick={() => exec('redo')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 transition-colors" title="Rehacer (Ctrl+Y)"><Redo size={14} /></button>
          <button type="button" onClick={() => exec('removeFormat')} className="p-1 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 rounded text-slate-400 transition-colors" title="Borrar Formato"><Eraser size={14} /></button>
        </div>

      </div>

      {/* Editor Content Area */}
      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onClick={handleEditorClick}
        data-placeholder={placeholder || "Escribe el contenido de la lección aquí... Usa viñetas o sube imágenes."}
        className="p-6 min-h-[300px] max-h-[600px] overflow-y-auto focus:outline-none dark:text-white prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-100 leading-relaxed font-sans"
        style={{ outline: 'none' }}
      />
      
      {/* Floating Word-style Image Controller */}
      {selectedImage && (
        <div 
          className="absolute z-30 bg-slate-950/95 text-white p-2 rounded-xl shadow-xl flex items-center gap-1.5 border border-slate-700/60 backdrop-blur-md select-none image-toolbar transition-all duration-200"
          style={{ top: `${toolbarCoords.top}px`, left: `${toolbarCoords.left}px` }}
        >
          {/* Tamaño */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700/50">
            <button 
              type="button" 
              onClick={() => adjustSize(-10)} 
              className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors" 
              title="Encoger tamaño (-10%)"
            >
              <Minus size={11} />
            </button>
            <span className="text-[9px] font-mono font-bold w-12 text-center text-brand-400">
              {selectedImage.style.width || '100%'}
            </span>
            <button 
              type="button" 
              onClick={() => adjustSize(10)} 
              className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors" 
              title="Agrandar tamaño (+10%)"
            >
              <Plus size={11} />
            </button>
          </div>

          {/* Ajuste Rápido */}
          <div className="flex items-center gap-0.5 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/50">
            <button type="button" onClick={() => setWidthPreset('25%')} className="px-1.5 py-0.5 hover:bg-slate-700 rounded text-[9px] font-bold" title="25% de ancho">25%</button>
            <button type="button" onClick={() => setWidthPreset('50%')} className="px-1.5 py-0.5 hover:bg-slate-700 rounded text-[9px] font-bold" title="50% de ancho">50%</button>
            <button type="button" onClick={() => setWidthPreset('100%')} className="px-1.5 py-0.5 hover:bg-slate-700 rounded text-[9px] font-bold" title="Ancho Completo">100%</button>
          </div>

          {/* Alineación (Ajuste Word) */}
          <div className="flex items-center gap-0.5 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/50">
            <button type="button" onClick={() => alignImg('left')} className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors" title="Ajuste de texto a la Izquierda"><AlignLeft size={11} /></button>
            <button type="button" onClick={() => alignImg('center')} className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors" title="Centrar Imagen"><AlignCenter size={11} /></button>
            <button type="button" onClick={() => alignImg('right')} className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors" title="Ajuste de texto a la Derecha"><AlignRight size={11} /></button>
          </div>

          {/* Estilos/Bordes */}
          <div className="flex items-center gap-0.5 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/50">
            <button type="button" onClick={() => toggleEffect('rounded')} className="p-1 hover:bg-slate-700 rounded text-[9px] font-bold text-slate-300 px-1.5" title="Bordes Redondeados (12px)">R</button>
            <button type="button" onClick={() => toggleEffect('shadow')} className="p-1 hover:bg-slate-700 rounded text-[9px] font-bold text-slate-300 px-1.5" title="Sombra Premium">S</button>
            <button type="button" onClick={() => toggleEffect('border')} className="p-1 hover:bg-slate-700 rounded text-[9px] font-bold text-slate-300 px-1.5" title="Borde Fino">B</button>
          </div>

          {/* Eliminar */}
          <button 
            type="button" 
            onClick={deleteImg} 
            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md shadow-red-900/30"
            title="Eliminar Imagen"
          >
            <Trash2 size={11} />
          </button>
        </div>
      )}
      
      {/* Bottom Bar Details */}
      <div className="p-1.5 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[10px] font-bold text-slate-400 select-none">
        <span>ESTILO PROCESADOR DE TEXTO (WORD) CON CONFIGURACIÓN DE IMÁGENES</span>
        <span>HAZ CLIC EN CUALQUIER IMAGEN PARA AJUSTARLA</span>
      </div>

      {/* Visual Image Resizing Overlay with Corner Handles */}
      {selectedImage && imgCoords && (
        <div 
          className="absolute border-2 border-brand-500 z-20 pointer-events-none"
          style={{ 
            top: `${imgCoords.top}px`, 
            left: `${imgCoords.left}px`, 
            width: `${imgCoords.width}px`, 
            height: `${imgCoords.height}px` 
          }}
        >
          {/* 4 corner resize handles with pointer-events-auto */}
          <div 
            className="absolute w-3.5 h-3.5 bg-white border-2 border-brand-500 rounded-full shadow-md image-resize-handle cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform" 
            style={{ top: 0, left: 0, transform: 'translate(-50%, -50%)' }}
            onMouseDown={(e) => startResize(e, 'tl')} 
          />
          <div 
            className="absolute w-3.5 h-3.5 bg-white border-2 border-brand-500 rounded-full shadow-md image-resize-handle cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform" 
            style={{ top: 0, right: 0, transform: 'translate(50%, -50%)' }}
            onMouseDown={(e) => startResize(e, 'tr')} 
          />
          <div 
            className="absolute w-3.5 h-3.5 bg-white border-2 border-brand-500 rounded-full shadow-md image-resize-handle cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform" 
            style={{ bottom: 0, left: 0, transform: 'translate(-50%, 50%)' }}
            onMouseDown={(e) => startResize(e, 'bl')} 
          />
          <div 
            className="absolute w-3.5 h-3.5 bg-white border-2 border-brand-500 rounded-full shadow-md image-resize-handle cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform" 
            style={{ bottom: 0, right: 0, transform: 'translate(50%, 50%)' }}
            onMouseDown={(e) => startResize(e, 'br')} 
          />
        </div>
      )}

    </div>
  );
}
