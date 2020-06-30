## CAPACIDAD HOSPITALARIA

>```js
>d3.json("/hosp_cap")
>```
>
>|   | Fecha      | Nombre_hospital                                      | Institucion | Estatus_capacidad_hospitalaria | Estatus_capacidad_UCI | Lat        | Lon         |
>|---|------------|------------------------------------------------------|-------------|--------------------------------|-----------------------|------------|-------------|
>| 0 | 25/06/2020 | INSTITUTO NACIONAL DE NUTRICIÓN                      | SSA         | Crítica                        | Crítica               | 19.289599  | -99.155441  |
>| 1 | 25/06/2020 | HOSPITAL GENERAL DE MÉXICO                           | SSA         | Media                          | Media                 | 19.4129258 | -99.1520225 |
>| 2 | 25/06/2020 | HOSPITAL GENERAL DR. MANUEL GEA GONZÁLEZ             | SSA         | Crítica                        | Media                 | 19.290295  | -99.160861  |
>| 3 | 25/06/2020 | CITIBANAMEX                                          | SSA         | Media                          | Crítica               | 19.439732  | -99.224235  |
>| 4 | 25/06/2020 | HOSPITAL REGIONAL DE ALTA ESPECIALIDAD DE IXTAPALUCA | SSA         | Media                          | Media                 | 19.318796  | -98.855353  |

## CASOS POR DELEGACION Y FECHA

>```js
>d3.json("/case_del_date")
>```
>
>|  | FECHA | MUNICIPIO RESIDENCIA | CASOS |
>|-|-|-|-|
>| 0 | 29/01/2020 | Iztacalco | 1 |
>| 1 | 07/02/2020 | Benito Juárez | 1 |
>| 2 | 12/02/2020 | Cuajimalpa de Morelos | 1 |
>| 3 | 27/02/2020 | Gustavo A. Madero | 1 |
>| 4 | 27/02/2020 | Iztapalapa | 1 |

## CASOS POR FECHA DE INGRESO

>```js
>d3.json("/case_date")
>```
>
>|  | FECHA INGRESO | CASOS - HOMBRES | CASOS - MUJERES | CASOS TOTALES |
>|-|-|-|-|-|
>| 0 | 13/01/2020 | 1 |  | 1 |
>| 1 | 28/01/2020 | 1 |  | 1 |
>| 2 | 30/01/2020 | 1 |  | 1 |
>| 3 | 07/02/2020 | 1 |  | 1 |
>| 4 | 27/02/2020 | 4 |  | 4 |

## CASOS POR DELEGACION

>```js
>d3.json("/case_del")
>```
>|  | DELEGACION | CASOS |
>|-|-|-|
>| 0 | Azcapotzalco | 11814 |
>| 1 | Benito Juárez | 4359 |
>| 2 | Coyoacán | 6359 |
>| 3 | Cuajimalpa de Morelos | 10844 |
>| 4 | Cuauhtémoc | 4624 |
>| 5 | Gustavo A. Madero | 11105 |

## CASOS VS AFLUENCIA DIARIA

>```js
>d3.json("/case_afluencia")
>```
>|  | FECHA | CASOS | AFLUENCIA TOTAL |
>|-|-|-|-|
>| 10 | 02/03/2020 | 2 | 6932366 |
>| 11 | 04/03/2020 | 2 | 7173088 |
>| 12 | 05/03/2020 | 1 | 7197222 |
>| 13 | 07/03/2020 | 1 | 5407096 |

## Enfermedades

>```js
>d3.json("/diseases_count")
>```
>|  | CONDICION | DATO | GENERO | 0-15 | 16-20 | 21-30 | 31-40 | 41-50 | 51-60 | 61-70 | 71-80 | 81-90 | 91+ | TOTAL |
>|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
>| 0 | TODOS | TODOS | TODOS | 5778 | 4902 | 40326 | 58602 | 57744 | 45469 | 26952 | 13804 | 5020 | 725 | 259322 |
>| 1 | TODOS | TODOS | MUJER | 2736 | 2574 | 20114 | 27686 | 26604 | 19825 | 11352 | 5803 | 2285 | 366 | 119345 |
>| 2 | TODOS | TODOS | HOMBRE | 3042 | 2328 | 20212 | 30916 | 31140 | 25644 | 15600 | 8001 | 2735 | 359 | 139977 |
>| 3 | TODOS | INTUBADOS | TODOS | 127 | 24 | 180 | 502 | 1164 | 1633 | 1508 | 874 | 270 | 27 | 6309 |
>| 4 | TODOS | INTUBADOS | MUJER | 59 | 11 | 62 | 143 | 302 | 490 | 511 | 306 | 109 | 13 | 2006 |

## CASOS POR GENERO

>```js
>d3.json("/cases_gender")
>```

## DEFUNCIONES POR GENERO

>```js
>d3.json("/deaths_gender")
>```