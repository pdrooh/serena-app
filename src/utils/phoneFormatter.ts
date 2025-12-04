import { useState } from 'react';

/**
 * Formata um número de telefone brasileiro automaticamente
 * @param value - Valor do telefone (apenas números ou com formatação)
 * @returns Telefone formatado no padrão (11) 99999-9999
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');

  // Aplica a máscara (11) 99999-9999
  if (numbers.length === 0) {
    return '';
  } else if (numbers.length <= 2) {
    return `(${numbers}`;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

/**
 * Remove a formatação do telefone, retornando apenas os números
 * @param value - Telefone formatado
 * @returns Apenas os números do telefone
 */
export const unformatPhoneNumber = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Valida se o telefone está no formato correto
 * @param value - Telefone formatado
 * @returns true se o formato estiver correto
 */
export const isValidPhoneNumber = (value: string): boolean => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(value);
};

/**
 * Hook para formatação automática de telefone
 * @param initialValue - Valor inicial do telefone
 * @returns Objeto com valor formatado e função para atualizar
 */
export const usePhoneFormatter = (initialValue: string = '') => {
  const [formattedValue, setFormattedValue] = useState(initialValue);

  const updatePhone = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormattedValue(formatted);
    return formatted;
  };

  return {
    formattedValue,
    updatePhone,
    isValid: isValidPhoneNumber(formattedValue),
    unformattedValue: unformatPhoneNumber(formattedValue)
  };
};
