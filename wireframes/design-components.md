# Epic Quiz App - Design System Components

## Component Library for Solo Development

### 🎨 Core Components

---

## 1. Cards & Surfaces

### Epic Card
```
┌──────────────────────────────┐
│  🕉️  THE RAMAYANA           │
│                              │
│  Ancient Indian Epic         │
│  🌟 Beginner Friendly        │
│                              │
│  ▓▓▓▓▓▓▓░░░ 342 Questions    │
│  🎯 Available                │
│                              │
│      [📖 Start Learning]     │
└──────────────────────────────┘
```
**Specs:**
- Background: White (#FFFFFF)
- Border Radius: 12px
- Padding: 20px
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Border: 1px solid Light Gray (#E0E0E0)

### Progress Card
```
┌─────────── 8/10 ──────────────┐
│                               │
│           80%                 │
│      ╭─────────╮              │
│      │ ▓▓▓▓▓▓▓ │              │
│      │ ▓ ░░░ ▓ │ Great Work!  │
│      │ ▓▓▓▓▓▓▓ │              │
│      ╰─────────╯              │
└───────────────────────────────┘
```
**Specs:**
- Circular progress ring: 4px stroke
- Success color: Light Green (#66BB6A)
- Background: Soft Gray (#F5F5F5)
- Center text: 32px Bold

---

## 2. Buttons

### Primary Button (CTA)
```
┌──────────────────────┐
│   📖 Start Learning  │
└──────────────────────┘
```
**Specs:**
- Background: Primary Saffron (#D4700A)
- Text: White (#FFFFFF)
- Font: 16px Semi-Bold
- Padding: 14px 24px
- Border Radius: 8px

### Secondary Button
```
┌──────────────────────┐
│   🏛️ Learn More      │
└──────────────────────┘
```
**Specs:**
- Background: Primary Blue (#1565C0)
- Text: White (#FFFFFF)
- Same dimensions as primary

### Ghost Button
```
┌──────────────────────┐
│   📤 Share           │
└──────────────────────┘
```
**Specs:**
- Background: Transparent
- Border: 2px solid Primary Blue (#1565C0)
- Text: Primary Blue (#1565C0)

---

## 3. Progress Indicators

### Progress Bar
```
▓▓▓▓▓░░░░░ 50%
```
**Specs:**
- Height: 8px
- Border Radius: 4px
- Fill: Primary Green (#2E7D32)
- Background: Light Gray (#E0E0E0)

### Question Counter
```
Question 5 of 10
```
**Specs:**
- Text: Medium Gray (#757575)
- Font: 14px Regular
- Above progress bar

---

## 4. Answer Options

### Default State
```
┌────────────────────────────────┐
│                                │
│  A) Vibhishana                 │
│                                │
└────────────────────────────────┘
```

### Selected State
```
┌────────────────────────────────┐
│                                │
│  B) Sugriva             ✅     │
│                                │
└────────────────────────────────┘
```

**Specs:**
- Background: White (#FFFFFF) → Light Blue (#BBDEFB) when selected
- Border: 2px solid Light Gray (#E0E0E0) → Primary Blue (#1565C0)
- Padding: 16px
- Font: 16px Regular
- Min Height: 56px for touch accessibility

---

## 5. Typography Scale

### Headings
- **Page Title**: 28px Semi-Bold, Charcoal (#2C2C2C)
- **Section Header**: 20px Medium, Charcoal (#2C2C2C)
- **Card Title**: 18px Semi-Bold, Primary Saffron (#D4700A)

### Body Text
- **Question Text**: 18px Regular, Charcoal (#2C2C2C)
- **Explanation**: 16px Regular, Dark Gray (#4A4A4A)
- **Labels**: 14px Medium, Medium Gray (#757575)
- **Captions**: 12px Regular, Medium Gray (#757575)

### Cultural Content
- **Cultural Context**: 16px Regular, Deep Saffron (#B7590A)
- **Cross References**: 14px Regular, Deep Green (#1B5E20)

---

## 6. Layout Containers

### Screen Container
```
Padding: 16px horizontal, 20px vertical
Background: Soft Gray (#F5F5F5)
Safe Area: Respected on all devices
```

### Content Section
```
Margin Bottom: 24px between sections
Card Spacing: 16px between cards
```

### List Items
```
Padding: 12px vertical
Border Bottom: 1px solid Light Gray (#E0E0E0)
```

---

## 7. Icons & Emojis

### Cultural Icons
- 🕉️ Hindu epics (Ramayana, Mahabharata)
- 🏛️ Greek epics (Odyssey, Iliad)
- 🏺 Roman/Classical content
- 📜 Historical texts

### UI Icons
- ✅ Correct answers (Light Green)
- ❌ Incorrect answers (Error Red #E57373)
- 📖 Learning/Reading actions
- 🎯 Quiz/Practice actions
- 🏆 Achievements/Results

### Progress Icons
- 🌟 Difficulty indicators
- ▓ Progress fill
- ░ Progress background
- 🔒 Locked content

---

## 8. Spacing System

### Margins & Padding
- **XS**: 4px
- **S**: 8px
- **M**: 16px (Standard)
- **L**: 24px
- **XL**: 32px

### Component Spacing
- **Card Internal**: 20px
- **Button Padding**: 14px vertical, 24px horizontal
- **Screen Margins**: 16px horizontal
- **Section Spacing**: 24px vertical

This component system provides **consistency, accessibility, and cultural appropriateness** while being simple enough for solo development and rapid iteration.