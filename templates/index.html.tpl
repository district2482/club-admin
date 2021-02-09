<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />    
    <link rel="icon" type="image/png" href="favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="favicon-194x194.png" sizes="194x194">
    <link rel="icon" type="image/png" href="favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="android-chrome-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="favicon-16x16.png" sizes="16x16">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using create-react-app" />
    <title>Ротари</title>
    <base href="/"/>

    {{range .CSSFiles}}
    <link href="{{ . }}" rel="stylesheet">{{end}}
</head>

<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
    </div>

    {{range .JSFiles}}
    <script type="text/javascript" src="{{ . }}"></script>{{end}}  
</body>

</html>