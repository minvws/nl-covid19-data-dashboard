export default {
  title: 'Actueel pagina',
  name: 'topicalPage',
  type: 'document',
  fields: [
    {
      name: 'isArticle',
      title: 'Laat uitgelicht artikel zien.',
      type: 'boolean'
    },
    {
      title: 'Uitgelicht artikel',
      name: 'highlightedArticle',
      type: 'reference',
      to: [{ type: 'article' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel'
    },
    {
      name: 'summary',
      description: 'Dit is te zien op de hoofdpagina van actueel',
      type: 'localeText',
      title: 'Samenvatting',
    },
    {
      name: 'href',
      type: 'localeString',
      title: 'Link',
    },
    {
      title: 'Afbeelding',
      name: 'cover',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          title: 'Alternatieve tekst (toegankelijkheid)',
          name: 'alt',
          type: 'localeString',
        },
      ]
    }
  ],
};


// {
// 	'highlight_article': *[_type == 'topicalPage'&& isArticle == false]{
//   	"article":highlightedArticle->{
// 			"title":title.nl,
//        slug,
//        "summary":summary.nl,
//        "cover": {
//         	...cover,
//         "asset": cover.asset->
//         }
//       }
//   }[0],
// 	'custom_message': *[_type == 'topicalPage'&& isArticle == true]{
//    		"title":title.nl,
// 		"summary":summary.nl,
// 		"cover": {
// 			...cover,
// 		"asset": cover.asset->,
//     href  
//   }
// 	}[0]
// }






// *[_type=='topicalPage']{
//   isArticle == true => {
// 		highlightedArticle->{
// 			"title":title.nl,
//        slug,
//        "summary":summary.nl,
//        "cover": {
//         	...cover,
//         "asset": cover.asset->
//         }
//      }
//   },
//   isArticle == false => {
// 		"title":title.nl,
// 		"summary":summary.nl,
// 		"cover": {
// 			...cover,
// 		"asset": cover.asset->,
//     href  
//     }
// }}[0]



// *[_type=='topicalPage']{
//   isArticle == true => {

// 			"title":title.nl,
//        slug,
//        "summary":summary.nl,
//        "cover": {
//         	...cover,
//         "asset": cover.asset->
//         }
     
//   },
//   isArticle == false => {
// 		"title":title.nl,
// 		"summary":summary.nl,
// 		"cover": {
// 			...cover,
// 		"asset": cover.asset->,
//     slug  
//     }
// }}[0]