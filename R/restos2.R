# Cargar librería para números primos (si no está instalada, install.packages("primes"))
library(primes)

# Generar los primeros 101 números primos (para tener 100 restos, desde p2 hasta p101)
primos <- generate_primes(min = 2, max = 1000)  # esto da más de 100, mejor especificar cantidad
primos <- generate_primes(min = 2, max = 550)   # ajustamos para que haya al menos 101
primos <- primos[1:101]                          # nos aseguramos exactamente 101

# Calcular restos: para i=2 a 101, primo[i] mod primo[i-1]
restos <- numeric(100)



for (i in 4:101) {
  restos[i-1] <- primos[i] %% primos[i-3]
}

# Ver los primeros restos
head(restos)

length(restos)

# Histograma
hist(restos, 
     main = "Histograma de restos de p_i mod p_{i-1}",
     xlab = "Resto",
     ylab = "Frecuencia",
     col = "skyblue",
     border = "black",
     breaks = 13)  
