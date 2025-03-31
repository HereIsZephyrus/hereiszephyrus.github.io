---
categories:
  - LectureNote
tags:
  - lecture
  - RS
title: GNSS原理及其应用笔记
description: GNSS原理及其应用课程笔记(更新中)
abbrlink: d82f29f9
date: 2025-03-17 00:00:00
---
# GNSS原理及其应用
`GNSS三大作用` 定位(Positioning),导航(Navigation),授时(Timing)
# Orientation: Development of GNSS Technologies
GPS for short, also named NAVSTAR GPS. GPS stands for Navigation Satellite Timing And Ranging Global Positioning System

## Overview

| Establish | Target | Started | Full Operational Capacity(FOC) | 
| -- | -- | -- | -- |
| The US | Provides real-time, continuous, all-weather positioning, navigation and timing PNT services globally | 1973 | 1995|

## GPS Policies

- SA(Selective Availability) policy
- SPS(Standard Positioning Service) policy
- PPS(Precise Positioning Service) policy


# Composition

## Space segment

> Kind of oribit levels
> ` Geostationary Earth orbit` 36000km 24h
> ` Graveyard oribit`
> ` MEO satellites` COMPASS, GLONASS, Galileo, GPS, etc.
> ` LEO satallites` : ISS, Hubble Iridium

**GPS constellation and its geometric distribution**

- nominally consisits of 24 operational satellities(21 + 3).
- Deployed in six evenly spaced orbit planes(A to F).
- With an inclination of 55 degrees and with four satellites per plane.
- Several active sparesatellites for replenishment are usually operational.
- Elliptical orbit with an average altitude of about 20200km.

<u>specifically, DBS uses three difference type: GEO/IGSO(inclined geosystemary orbit)/MEO.</u>(this arrangement reflects some development of BDS)

### resection

for any single satellite:
$$
\begin{cases}
P_r^s &= c(T_r - T^s) \\
T_r &= t_r + \delta t_r \\
T^s &= t^s + \delta t_s \\
\end{cases} \tag 1
$$

which $T$ means the observed time, $t$ means the true time. to simplify: 

$$
\begin{aligned}

P_r^s &= c(t_r - t^s ) + c(\delta t_r - \delta t^s) =\rho_r^s + c(\delta t_r - \delta t^s) \\
&= \sqrt{(x_r - X^s)^2 + (y_r - Y^s)^2 + (z_r - Z^s)^2} + c(\delta t_r - \delta t^s)
\end{aligned}
\tag 2
$$

$\rho$ stands for the distance between user and satellite. $\delta t_r$ stands for the error of user, $\delta t_s$ stands for the error of satellite, which is recieved from satellite.

align four satellites: 

$$
\begin{cases}
P_r^{t_1} &= \sqrt{(x_r - X^{s1})^2 + (y_r - Y^{s1})^2 + (z_r - Z^{s1})^2} + c(\delta t_r - \delta t^{s1}) \\
P_r^{t_2} &= \sqrt{(x_r - X^{s2})^2 + (y_r - Y^{s2})^2 + (z_r - Z^{s2})^2} + c(\delta t_r - \delta t^{s2}) \\
P_r^{t_3} &= \sqrt{(x_r - X^{s3})^2 + (y_r - Y^{s3})^2 + (z_r - Z^{s3})^2} + c(\delta t_r - \delta t^{s3}) \\
P_r^{t_4} &= \sqrt{(x_r - X^{s4})^2 + (y_r - Y^{s4})^2 + (z_r - Z^{s4})^2} + c(\delta t_r - \delta t^{s4}) \\
\end{cases}
$$
the unknown parameters are$(x_r,y_r,z_r,\delta t_r)$.

### coordinate system
compoents: Celestial and terrestrial reference systems

` definition`
- Origin, orientation and scale
- Determined by convertions
- Conventinal inertial sysem(CIS)
- Conventional terrestrial system(CTS)

#### `basic concepts of celestial sphere`
- Celestial Sphere
- Celestial Axis
- Celestial Poles
- Celestial Equator
- Celestial Meridian
- Hour Circle
- Ecliptic
- Obliquity of the Ecliptic
- Ecliptic Poles
- Verbal Equinox/First point of Aries
- Autumnal Equinox

#### Conventional inertial system
- `Origin` geocenter
- `Z-axis` towards the north celestial pole
- `X-axis` Verbal Equinox
- `Y-axis` completes a right-handed system

> Since Earth's center of mass undergoes small accelerations because of the annual motion around the sum, this is a quasi-inertial system.

#### Conventinal terrestrial system
- Earth-center Earth-fixed (ECEF)
- `Origin` geocenter
- `Z-axis` coincides with thr rotation axis of Earth
- `CIO`
- `GMO`

#### Transition from thr space-fixed CIS and Earth-fixed CTS

- The same origin and the same orientation of z(z)-axis
- The angle between x-axis and X-axis is the GAST of equinox

[CIS] -> (Precession and nutation) -> [True instantaneous celestial] -> (GAST of true equinox) -> [True instantaneous terrestrial] -> (Polor motion) -> [CTS]

#### Precession and nutation

`true equator` nutation and precession
`mean equator` mean oribit (without nutation)

#### Polar motion
- Earth is not solid
- The relative position of th instantaneous true pole with respect to the conventional terrestrial pole CTP is usually described throught the pole coordinates.

## Control segment

## User segment

# Time Zone

## Time

- UTC, GPST, ATI, UT1, etc. See the textbook.

## Calendar

- Civil date(day, month, year)
- Julian Day(JD)
- Modified Julian Day(MJD)--align zero of the day with civil day
- Year and day of the year(DOY)
- Second of the day
- GPS week and the second of week

# Satellite Orbits

Precise time-dependent satellite positions in a suitable reference frame are required for nearly all tasks in satellite geodesy.

<u>The accuracy of the final results depends on the accuracy of the available satellite orbits</u>

## External forces actiong on the satellite

- Gravitational force of Earth(Spherical gravity / Non-spherical gravity)
- Gravitational forces of the Sun, The mOOn and other celestial bodies
- Atmospheric drag
- Direct solar radiation pressure(SRP)
- Earth-reflected SRP
- Other foces(oceanic tides, geomagnetic field, etc.)

## Two-body problem

> The simplest form 

1. For artificial satellites, the mass can be neglected compared with the mass of the central body.
2. Under the assumption that the bodies are homogeneous and thus generate the gravitational field of a poiont mass.(descripted by Kepler's law)

Ephemeris computation refers to geocentric or topocentric positions of celestial bodies or artificial satellites that are derived from orbital.

## Kepler's laws

1. *The orbit of each planet is an ellipse with the Sum at one focus*

- $A$: apocenter/aphelion
- $\pi$: perienter/perihelion
- $\nu$: true anomaly
- $r$: distance of the point mass m from the center of the primary mass
- $e$: numerical eccentricity
- $ae$ linear eccentricity
- $\psi$: eccentricity angle

2. *The line from the Sun to any planet sweeps out equal areas of space in equal lengths of time*

- Describes the velocity of a planet in its orbit
- Determine the location of a planet as a function of time with polar coordinates $r$ and $\nu$

3. *The cubes of semi-major axes of the planetary orbits are proportional to the squares of the planet's periods of revolution*

### Kaplerian orbital parameters

- $a$ semi-major axis
- $e$ numerical eccentricity
- $\Omega$ right ascension of ascending node
- $\omega$ argument of perigee
- $\nu$ true anomaly

# Satellite signal

The four major GNSS are passive one-way downlink ranging systems

**The satellite emits modulated signals that include**: 

- The time of transmission to deive ranges
- The modeling parameters to compute satellite positions

**A three-layer model describe the emitted satellite signals best**

- `Physical layer` characterizes the physical properties
- `Ranging code layer` describes the methods of measuring the propagation time
- `Data-link layer` commonly contains satellite ephemerides

## Compoents of GPS signal

`Fundamental freqiency` $f_0=10.23MHz$.Gnerated by the oscillators on board the satellites.
`Carrier signals in the L-band` Generated by integer multiplications of $f_n$(between Micro-wave and Radio).$f_{L1}=154f_0$,$f_{L2}=120f_0$, $f_{L3}=115f_0$(military users only)
`Ranging codes`
1. `C/A-code`(coarse/acquisition or clear/access code)$f_0/10$
2. `P-code`(precise or protected code)$f_0$
3. `W-code`used to encrypt the P- and Y-codes when AS is implemented $f_0/20$

`Navigation message` 50HZ

## Pseudorandom noise(PRN) codes

in mathematical terminology two ranging codes $c_i$,$c_j$ with noise like characteristics have to meet the following ideal requirements(assume signal level +1, -1).
`PRN code` sequences meets four requirements: 

1. Mean value of the code sequence

$$
M[c_i(t)] = M[c_j(t)]=0
$$

2. Autocorrelation at zero

$$
M[c_i^2(t)] = M[c_j^2(t)] = T_p
$$

the autocorrelation function is: 

$$
R(j) = \frac{A-D}{A+D} = \frac{A-D}{m}
$$

which $D$ is a number related with $j$ shift. It can be inferred: 

$$
R(j)
=
\begin{cases}
1 & j = \pm (km) (k \in Z)\\
-\frac 1 m & j \neq \pm (km) (k \in Z)
\end{cases}
$$

3. Crosscorrelation property

$$
M[c_i(t + \tau)c_j(t)] = 0 (\forall i \neq j)
$$

4. Values of the autocorrelation function, accounting for the periodicity of signals

$$
M[c_i(t + \tau)c_j(t)] = 0 (\forall \tau \text{ modulo } T_p \neq 0)
$$



<u>Orthogonality and good autocorrelation characteristics are fundamental requirements for high_accuracy time measurements and good interference mitigation</u>. These sequences have noise like behavior with maximum autocorrelation at zero lag($\tau$=0)

### Generation of PRN codes
PRN codes for navigation signals are commonly generated using *linear feedback shify registers(LFSR)*

`LFSR` is characterized by the number of register cells n and the characteristic polynomial p(x), which defines the feedback cells.

The states of the feedback cells of the register are XOR-added and fed back as new input into LFSR.

The XOR-adders thereby characterize the linearity of LFSR

An increasing number of register cells results i a longer PRN code and in a better correlation property.

The maximum length $N_m$ of the PRN code is defined by $N_m = 2^n-1$(all zeros are now allowed)

> The C/A code is generated by the combination of two 10-bit LFSR(10 defining cells)

![CAcode](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/CA_code.png)

**The design of PRN codes are above all the code length, the code rate, and the autocorrelation and crosscorrelation properties.**

## `CDMA` code division multiple access

- GPS applies the CDMA principle, consequenctly, the GPS satellite emit different PRN codes.
- The frequency of 1.023MHz and the repetition rate of 1 millisecond results in a code length of 1023 `chips`(bits of the PRN sequences) ( The time interval between two chips is just under 1 microsecond which approximately corresponds to a 300m chip length)

# Navigation message

for every frame: 
1. `Telemetry Word`
2. `Hand Over Word`
3. `The first subframe`

> The content of subframes 1 through 3 is repeated in ebery frame to provide critival datellite-specific data with hifh repetition rate

THe content of the fourth and the fifth subframe is changed in every frame and has a repetition rate of 25 pages.

A subframe takes 6 second, 10 words, 30 bits every word.

## Signal processing

The satellite generate a signal by modulating a ranging code and data message onto the carrier frequency.

The different signals are then multiplexed and `RHCP`(right-handed circularly polarized)

## Receiver design
The generic GNSS receiver is composed of three functional blocks: 

1. Radio frequency front-end`RF`
2. Digital signal processor`DSP`
3. Navigation processor

### Antenna design

Antennas receive the satellite signals, transform the energy of the electronmagnetic wavesinto electric currents.Ingeneral, the antenna gain is a function of azimuth and elevation.

**Omnidirectional antennas have a uniform antenna gain pattern in all directions**, and are generally used in GNSS applications.

For static applications, the gain is limited as for as possivle to the upper hemisphere by using, *e.g. ground plane or choke ring design. In the other hand, marine applications require a uniform gain pattern also below the horizon to cpmpensate for rolling and pitching of the ship.*

# Observables

**Satellite navigation uses the "one-way concept"** The satellite navigation ovservables are ranges which are deduced from measured time or phase differences based on a comparison between received signals and receiver-generated signals.
consequently, they are denoted as `pseudorange`

> Three observation types: pseudorange, phase, dopler's effect

## Code pseudoranges

`ts` the signal emission time. **reading of the satellite clock**
`tr` the signal reception time. **reading of the receiver clock**

code correlation procedure: 
$$
t_r(rec) - t^s(sat) = [t_r + \delta_r] - [t^s + \delta^s] = \Delta t + \Delta \delta
$$

code pseudorange: 

$$
R = c[t_r(rec) - t^s(sat)] = c \Delta t + c \Delta \delta = Q + c \Delta \delta
$$

## Phase pseudoranges
**Beat phase**Any deviation between generated frequency and incoming one is a measure of the remaining Deppler shift and will result in a beaf frequency and a beat phase.

$\phi s(t)$ and $\phi r(t)$ are defined as above, which: 

$$
\begin{aligned}
\phi^s(t) &= f^st - f^s\frac Q c - \phi_0^s \\
\phi_r(t) &= f_rt - \phi_0r
\end{aligned}
$$

hence: 

$$
\phi_r^s(t) = \phi^s(t) - \phi_r(t) = -f^s \frac Q c + f^s \delta^s - f_r\delta_r + (f^s - f_r)t
$$

## Biases and noise

**Doppler measurements are affected by the bias rates only.**

### Error sources

- satellite-related errors
- propagation-medium-related errors
- receiver-related errors

### Differencing

- Differencing measurements of *two receivers to the same satallite* eliminates satellite-specific biases.
- Differencing *bewteen two satellites to the same receivers* eliminates reciever-specific biases.
- Differencing *between epochs*.

> 在GPS测量中，每⼀瞬间要对多颗卫星进⾏观测，因⽽在每颗卫星的载波相位测量观测值中，所受到的接收机振荡器的随机误差的影响是相同的

> double-difference pseudoranges are free of systematic erroes originating from the satellites and from the receivers.

with respect to refraction, this is only true for **short baselines** where the measured ranges at both enpoint are affected equally.

### User equivalent range error

The `UERE` is obtained: Extending the URE by the user equipment and environmental errors.

The UERE is computed as square root of the summed squares of the six error constituents ephemerides data, satellite clock, ionosphere, troposhpere, multipath, and reciver measurement.

### Ionospheric refraction

**Ionospheric refaction is frequency depended. (Dispersion)**

$$
\frac{\sin \beta_i}{\sin \beta_r} = \frac{n_2}{n_1} = \text{constant}
$$

The true distance is: 

$$
\begin{aligned}
S &= \int_{\Delta t}v_G dt = \int_{\Delta t}c(1 - 40.28N_ef^{-2})dt \\
&= c \cdot \Delta t - c \frac{40.28}{f^2}\int_{s'}N_e dS \\
&= \rho - c \frac{40.28}{f^2}\int_{S'}N_e dS = \rho + d_{ion}
\end{aligned}
$$

> The ionosphere is a dispersive medium at 1.5GHz, while the troposhere is not.

Because: 
$$
\begin{cases}
\text{Parse refractive index:}n_{ph} = 1 + \frac{c_2}{f^2} \\
\text{Group refractive index:}n_{gr} = 1 - \frac{c_2}{f^2}
\end{cases}
,(c_2 = -40.3N_e[Hz^2])
$$

GNSS ranging codes are delayed and the carrier phases are advanced: 

$$
\begin{cases}
TEC &= \int N_e d s_0 \\
\Delta^{Iono}_{ph} &= -\frac{40.3}{f^2} TEC \\
\Delta^{Iono}_{gr} &= \frac{40.3}{f^2} TEC
\end{cases}
$$

Since the baseline between satellite and observation is not vertical with the Ionosphere. So $TEC = \frac{1}{\cos z'}TVEC$, which $z'$ is zenith angle, calcuated by equation of single-layer model: $\sin z'=\frac{R_e}{R_e + h_m}\sin z_0$ ($h_m$ is the ionospheric point's height). 

Consider the two different frequency signal broadcast by one satellite, the estimation are: 

$$
\begin{cases}
\lambda_1 \Phi_1 &= \rho + c \Delta \delta + \lambda_1 N_1 - \Delta^{Iono}_1 \\
\lambda_2 \Phi_2 &= \rho + c \Delta \delta + \lambda_2 N_2 - \Delta^{Iono}_2 \\
\end{cases}
$$

Because $\lambda = ct = \frac c f$, the above are: 

$$
\begin{cases}
\Phi_1 &= \frac{f_1}{c}\rho + f_1 \Delta \delta + N_1 - \frac{f_1}{c} \Delta_1^{Iono} \\
\Phi_2 &= \frac{f_2}{c}\rho + f_2 \Delta \delta + N_2 - \frac{f_2}{c} \Delta_2^{Iono}
\end{cases}
$$

Because the property of Ionoshere: 

$$
\frac{f^2}{c}\Delta^{Iono} = \frac{1}{c} \frac{40.3}{\cos z'}TVEC
$$

Which means: 

$$
\frac{f_1^2}{c}\Delta_1^{Iono} = \frac{f_2^2}{c}\Delta_2^{Iono} = \frac{1}{c} \frac{40.3}{\cos z'}TVEC
$$

Multify $f_1$ and $f_2$ for the two equations and substrct: 

$$
\Phi_1f_1 - \Phi_2f_2 = (\frac{\rho}{c} + \Delta \delta)(f_1^2 - f_2^2) + N_1f_1 - N_2 f_2
$$

By this way the bias raised by ionoshpere are eliminated.

The observation equation is: 

$$
\begin{aligned}
(\Phi_1 - \frac{f_2}{f_1}\Phi_2) \frac{f_1^2}{f_1^2 - f_2^2} &= (\frac{\rho}{c} + \Delta \delta)f_1 + (N_1 - N_2 \frac{f_2}{f_1})\frac{f_1^2}{f_1^2 - f_2^2} \Longrightarrow\\
(\Phi_1 - k\Phi_2) \frac{1}{1 - k^2} &= (\frac{\rho}{c} + \Delta \delta)f_1 + (N_1 - kN_2)\frac{1}{1-k^2}
\end{aligned}
$$

or consider pseudoranges: 

$$
\begin{cases}
R_1 &= \rho + c \Delta \delta + \Delta^{Iono}_1 \\
R_2 &= \rho + c \Delta \delta + \Delta^{Iono}_2
\end{cases}
$$

then multify $\frac{f^2}{c}$: 

$$
\begin{cases}
R_1 \frac{f_1^2}{c} &= \rho \frac{f_1^2}{c} + c \Delta \delta \frac{f_1^2}{c} + \Delta^{Iono}_1 \frac{f_1^2}{c}\\
R_2 \frac{f_2^2}{c} &= \rho \frac{f_2^2}{c} + c \Delta \delta \frac{f_2^2}{c} + \Delta^{Iono}_2 \frac{f_2^2}{c}
\end{cases}
$$

$$
(R_1 - \frac{f_2^2}{f_1^2}R_2) \frac{f_1^2}{f_1^2 - f_2^2} = \rho + \Delta \delta
$$

### Troposheric refraction

`Troposhere` neutral atmoshpere (the noninized part)

> extends from the earth's surface to about 50km height

a `nondispersive` medium with respect to radio waves up to frequencies of 15 GHz. (*propagation is frequency independent*, so an elimination of troposheric refraction by dual-frequency methods is impossible)

#### Troposphere delay

consists of a **dry**(90% delay, mainly a function of pressure) and **wet**(water vapor, high variability) component.

(many magic models to solve this)

### Receiver

`RINEX` The Receiver Independent Exchange Format

`cut-off angle` only receive the satellites whose zenith angle is above cut-off angle.

# Navigation

## Point positioning

$n_s$ denotes the number of satellites and $n_t$ the number of epochs.

### Static point positioning

the three coordinates of the observing site and the reciver clock bias for each observation epoch are unknown. This, the number of unkowns is $3+n_t$

$$
n_s n_t \geq 3 + n_t
$$

so the minimum number of satellites to get a solution is $n_s = 2$, leading to $n_t \geq 3$ observation epochs.Which means for $n_s = 4$, the solution $n_t \geq 1$ is obtained.

### kinematic point positioning

Due to the motion of the receiver, the number of the unkown station coordinates is $3n_t$.Need to add the $n_t$ unknown receiver clock biases. 

$$
n_s n_t \geq 4n_t
$$

### Precise point positioning(PPP)

The main limiting factors with respect to the achievable accuracy are: 

1. the orbit errors
2. the clock errors
3. the atmosperic influences(ionospheric and tropospheric refraction)

PPP: 
- accurate orbital data
- accurate satellite clock data
- dual-frequency code pseudoranges and carrier phase observations
- The preferred model is based on an ionosphere-free combination of code pseudoranges and carrier phases as well

#### model refinements

Additional terms are necessary to account for: 

- the Sagnac effect
- the solid earth tides
- the ocean loading
- the atmoshperic loading(caused by the atmospheric pressure variation)
- polar motion, earth orientation effects, crustal motion and other deformation effects
- the antenna phase center offset
- antenna phase wind-up error

**Choose a proper weighting of the obervations.**(e.g. near the horizon get a lower weight)

### Linearization

$$
\begin{aligned}
\rho_r^s &= \sqrt{(X^s(t)-X_{r0})^2 + (Y^s(t)-Y_{r0})^2 + (Z^s(t)-Z_{r0})^2}\\
&= f(X_{r0},Y_{r0},Z_{r0})
\end{aligned}
$$

and

$$
\begin{cases}
X_r &= X_{r0} + \Delta X_r \\
Y_r &= Y_{r0} + \Delta Y_r \\
Z_r &= Z_{r0} + \Delta Z_r \\
\end{cases}
$$

use Taylor series with respect to the approximate position and gredient descent.

### user equivalent range error

UERE is the overall error budget: 

$$
\sigma_{\text{UERE} } = \sqrt{\sigma^2_{\text{sc} } + \sigma^2_{\text{eph} } + \sigma^2_{\text{iono} } + \sigma^2_{\text{trop} } + \sigma^2_{\text{mp} } + \sigma^2_{\text{rc} } + \sigma^2_{\text{noise} }}
$$

this measurement error is mapped onto the position error by the receiver-satellite geometry.

#### Dilution of precision(DOP)

**Geometry impact**: 
a good geometry ensure a good precision.

Visibility thereby is characterized by the unobstructed line of sight between receiver and satellite.

The geometry changes with time duet to the relative motion of the user and satellites.

**A measure of the instananeous geometry is the DOP factor**

The determinant if proportional to the scalar triple product$((\rho_r^4 - \rho_r^1),(\rho_r^3,\rho_r^1),(\rho_r^2 - \rho_r^1))$, which can geometrically be interpreted by the volume of a tetrahedron. And **the larger the volume of this body, the better the satellite geometry**, since good geometry should mirror a low DOP value.

Generally, to estimate the accuracy of point positioning  precision: 

$$
m = URA \cdot xDOP
$$

#### Calc DOP

$$
Q_X = (A^\intercal P A)^{-1}
$$

Capital X is used here as an indication of coordinates of an ECEF system. The cofactor matrix $Q_X$ is a $4 \times 4$ matrix, where three components are contributed by the site position X, Y, Z and one compoenet by the receiver clock.

transfer global cofactoe matrix $Q_X$ must be transformed into local cofactor matrix $Q_X$ by the law of covariance propagation. 

$$
Q_X = R Q_X R^\intercal
$$

i.e. convert $(x,y,z)$ into $(n,e,u)$. 