library(primes)

# Generar primeros 100 primos
primos <- generate_primes(min = 2, max = 550)[1:100]

# Inicializar dataframe de resultados
resultados <- data.frame(k = integer(),
                         resto_moda = integer(),
                         frecuencia = integer())

# Para cada k desde 1 hasta 10
for (k in 1:10) {
  restos <- numeric(100 - k)  # vector para guardar restos
  
  for (i in (k+1):100) {
    restos[i - k] <- primos[i] %% primos[i - k]
  }
  
  # Calcular frecuencias
  tabla_frec <- table(restos)
  
  # Moda y su frecuencia
  resto_moda <- as.integer(names(tabla_frec)[which.max(tabla_frec)])
  freq <- max(tabla_frec)
  
  # Guardar
  resultados <- rbind(resultados, data.frame(k = k,
                                             resto_moda = resto_moda,
                                             frecuencia = freq))
}

# Mostrar resultados
print(resultados)