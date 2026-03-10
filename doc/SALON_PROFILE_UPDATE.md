# Salon Profile Update Documentation

## Overview

The **Salon Profile** defines the public identity of a salon in the platform.
Salon owners must complete this profile before customers can **discover, book, or interact with the salon**.

The system also optimizes uploaded images and generates location coordinates automatically.

---

# Salon Profile Fields

## 1. Logo

**Required:** Yes

The salon logo represents the brand identity of the business.

### Image Optimization Rules

When a logo is uploaded the system automatically:

1. Compresses the image
2. Converts it to **WebP format**
3. Generates multiple sizes for performance

Generated sizes:

| Size    | Usage        |
| ------- | ------------ |
| 128x128 | small icons  |
| 256x256 | salon cards  |
| 512x512 | profile page |

### Upload Limits

Allowed formats:

```
JPG
PNG
WEBP
```

File size before processing:

```
Max: 15MB
```

After optimization:

```
~50KB – 200KB
```

### Why Optimization is Important

Benefits:

* Faster page loading
* Lower CDN bandwidth
* Better mobile performance
* Better SEO

---

## 2. Cover Image

**Required:** Yes

The cover image appears at the top of the salon profile page.

### Image Optimization

The system automatically:

* Resizes image
* Compresses file
* Converts to **WebP**

Generated sizes:

| Size   | Usage   |
| ------ | ------- |
| 480px  | mobile  |
| 960px  | tablet  |
| 1920px | desktop |

Recommended upload resolution:

```
1920 × 800
```

Maximum upload size:

```
25MB
```

---

## 3. Salon Name

**Required:** Yes

The salon name is **NOT required to be unique**.

Many salons may share the same name.

Example:

```
Beauty Salon
Golden Scissors
Luxury Hair Studio
```

Because salon names may duplicate, the system uses **Public Handle** for unique identification.

---

## 4. Public Handle

**Required:** Yes (Auto-generated)

The **Public Handle** is the unique identifier used for public URLs.

Example:

Salon Name:

```
Golden Scissors
```

Generated Handle:

```
@golden_scissors
```

If the handle already exists the system automatically modifies it:

```
@golden_scissors_1
@golden_scissors_2
```

### Allowed Characters

```
a-z
0-9
_
@
```

Spaces and special characters are **not allowed**.

### Example URLs

```
app.com/@golden_scissors
app.com/@golden_scissors_2
```

---

## 5. Philosophy & Bio

**Required:** Optional

Short description of the salon.

Maximum length:

```
500 characters
```

Example:

```
Modern hair styling with a focus on healthy hair and natural beauty.
```

---

## 6. Primary Address

**Required:** Yes

The physical address of the salon.

Example:

```
45 Beach Road
Negombo
Sri Lanka
```

Used for:

* Map display
* Navigation
* Nearby salon search

---

## 7. City

**Required:** Yes

Used for **city-based salon discovery**.

Example:

```
Colombo
Negombo
Kandy
```

---

## 8. Area / Neighbourhood

**Required:** Yes

More specific area inside the city.

Example:

```
Kochchikade
Bambalapitiya
Dehiwala
```

This improves **local search accuracy**.

---

## 9. Social & Website

**Required:** Optional

Salons can add external links.

Supported platforms:

```
Instagram
Facebook
TikTok
Website
```

Example:

```
instagram.com/golden_scissors
facebook.com/golden_scissors
```

---

## 10. Latitude

**Auto-generated**

Latitude is automatically retrieved from the address using geocoding.

Example:

```
7.2083
```

---

## 11. Longitude

**Auto-generated**

Example:

```
79.8358
```

Used with latitude for:

* Nearby search
* Map display
* Distance calculation

---

## 12. Operating Hours

**Required:** Yes

Defines when the salon is open for bookings.

Example:

| Day       | Open   | Close |
| --------- | ------ | ----- |
| Monday    | 09:00  | 20:00 |
| Tuesday   | 09:00  | 20:00 |
| Wednesday | 09:00  | 20:00 |
| Thursday  | 09:00  | 20:00 |
| Friday    | 09:00  | 21:00 |
| Saturday  | 09:00  | 21:00 |
| Sunday    | Closed |       |

Rules:

* At least **1 operating day required**
* Bookings cannot be made outside these hours.

---

# Profile Completion Requirements

A salon **must complete the following fields** before accepting bookings:

```
Logo
Cover Image
Salon Name
Public Handle
Primary Address
City
Area / Neighbourhood
Operating Hours
```

If incomplete the system shows a warning banner:

```
⚠ Please complete your salon profile before accepting bookings.
```

---

# Image Storage Best Practice

Images should be stored using a **CDN or object storage**.

Example:

```
AWS S3
Cloudflare R2
Google Cloud Storage
```

Example storage structure:

```
/salons
   /salon_id
       /logo
       /cover
```

Example file:

```
/salons/124/logo/256.webp
```

---

# Future Enhancements

Possible improvements:

* Map location picker
* Multiple salon branches
* AI-generated salon descriptions
* Verified business badge
* Image auto background removal
* AI image enhancement

---
