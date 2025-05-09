<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <style>
        @page {
            size: A4;
            margin: 3cm;
        }

        #page {
            height: max-content;
        }

        .page h1 {
            font-size: 14pt;
            font-weight: 700;
            text-align: center;
            counter-reset: h2-counter fig-counter caption-counter;
            counter-increment: h1-counter;
            margin-bottom: 10pt;
            margin-top: 10pt;
            page-break-before: always;
            break-before: page;

        }

        .page img:focus {
            @apply ring-blue-500
        }

        .page h1::before {
            content: "BAB " counter(h1-counter) "\A";
            font-weight: bold;
            white-space: pre-line;
        }

        .page h2 {
            font-size: 12pt;
            font-weight: 600;
            margin-bottom: 4pt;
            display: list-item;
            list-style: none;
            counter-increment: h2-counter;
            counter-reset: h3-counter;
        }

        .page table {
            max-width: 14cm !important;
            border-bottom: 1px solid black;
            border-collapse: collapse;

        }

        .page table td,
        table th {
            position: relative;
        }

        td[colspan] {
            border-right: none;
        }

        .selectedCell::after {
            background: rgba(0, 0, 0, 0.07);
            content: "";
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            pointer-events: none;
            position: absolute;
            z-index: 2;
            width: 100%;
        }

        .page figure[data-type="figureTable"]>figcaption {
            width: 14cm !important;
            text-align: center;
            counter-increment: caption-counter;
        }

        .page figure[data-type="figureTable"]>figcaption::before {
            content: "Tabel " counter(h1-counter) "." counter(caption-counter) " ";
        }



        .page figure[data-type="imageFigure"] {
            text-align: center;
            align-items: center;
            widht: 100%;
            display: flex;
            flex-direction: column;
        }

        .page th,
        .page td {
            text-align: left;
            min-width: 100%;
        }

        .page td>div {
            width: 100%;
        }

        .page th {
            border-bottom: 1px solid black;
            border-top: 1px solid black
        }


        .page h2::before {
            content: counter(h1-counter) "." counter(h2-counter) " ";
            font-weight: bold;
        }

        .page h3::before {
            content: counter(h1-counter) "." counter(h2-counter) "." counter(h3-counter);
            font-weight: bold;
        }

        .page h3 {
            font-size: 12pt;
            font-weight: 600;
            margin-bottom: 3pt;
            display: list-item;
            list-style: none;
            counter-increment: h3-counter;
        }

        .page figcaption {
            counter-increment: fig-counter;
        }

        .page figcaption::before {
            content: "Gambar " counter(h1-counter) "." counter(fig-counter) " ";
        }

        .page-break {
            width: 21cm;
            height: 6cm;
            margin-left: -4cm;
            position: relative;
        }

        .page .tiptap>p {
            text-indent: 1.27cm;
            margin-top: 0;
            margin-bottom: 0.5em;
            text-align: justify;
        }

        .ProseMirror p {
            max-width: 14cm;
            text-align: justify;
            hyphens: auto;
            hyphenate-limit-chars: 3 3 3;
            overflow-wrap: break-word;
        }

        .page>.tiptap {
            max-width: 14cm !important;
        }

        .tiptap {
            margin: 0;
            padding: 0;
        }

        .page li p {
            text-indent: 0;
        }

        .page ol {
            list-style-position: outside;
            list-style-type: decimal;
            margin-left: 2.5em;
        }
        

        .page ul {
            list-style-type: disc;
            margin-left: 2.5em;
        }

        .page {
            /* width: 210mm; */
            /* padding: 3cm 3cm 4cm 4cm; */
            /* margin: 0 auto; */
            padding-right: 3px;
            padding-left: 4px;
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.5;
            overflow-y: hidden;
            box-sizing: border-box;
            page-break-after: always;
            font-size: 12pt;
            position: relative;
        }

        .tiptap {
            min-height: max-content;
        }

        .page-break {
            height: 20px;
            width: 100%;
            border-top: 1px dashed #ccc;
            margin: 10px 0;

        }

        .tiptap:focus {
            outline: none;
        }

        .page cite {
            font-style: normal;
        }

        .latex-var {
            cursor: pointer;
            position: relative;
        }

        .latex-var::before {
            max-width: 20rem !important;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            white-space: normal;
            border-radius: .25rem;
            padding: .25rem .5rem;
            font-size: .875rem;
            line-height: 1.25rem;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(3px);
            color: white;
            width: max-content !important;
            transition-duration: .2s;
            transition-timing-function: cubic-bezier(.4, 0, .2, 1);
            transform: translate(-50%);
            font-weight: 700;
            top: auto;
            left: 50%;
            opacity: 0;
            right: auto;
            bottom: calc(100% + 1px + .1875rem);
            position: absolute;
            pointer-events: none;
            z-index: 1;
            text-indent: 0;
            content: "@var \\" attr(var);
        }

        .latex-var:hover::before {
            opacity: 1;
            transition-delay: 75ms;
        }

        table[type="longtable"] {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid;
        }

        table[type="tabular"] {
            border-collapse: separate;
            border-spacing: 5px;
        }



        .menu {
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            z-index: 100;
        }

        .page h1 {
            position: relative;
        }

        .page h1:hover::after {
            opacity: 1;
        }

        .page h1::after {
            content: "Editable, But won't affected";
            white-space: nowrap;
            background-color: rgba(1, 1, 1, 0.45);
            border-radius: 5px;
            color: white;
            position: absolute;
            text-align: center;
            z-index: 555;
            opacity: 0;
            transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
            pointer-events: none;
            height: max-content;
            font-size: 12px;
            font-family: var(--font-mono, system-ui);
            ;
            right: 50%;
            padding: 0 .4em;
            top: -5px;
        }
    </style>
    <title>Document</title>
</head>

<body>
    <div class="page">
        <div class="tiptap ProseMirror">
            {!! $html !!}
        </div>

    </div>
</body>

</html>
