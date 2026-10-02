const fs = require('fs');

function extractFormSpec(htmlPath) {
  if (!fs.existsSync(htmlPath)) return null;
  const html = fs.readFileSync(htmlPath, 'utf8');
  const inputs = [...html.matchAll(/<input[^>]*>/gi)].map(m => m[0]);
  const selects = [...html.matchAll(/<select[^>]*>[\s\S]*?<\/select>/gi)].map(m => m[0]);
  const buttons = [...html.matchAll(/<button[^>]*>[\s\S]*?<\/button>/gi)].map(m => m[0]);
  const forms = [...html.matchAll(/<form[^>]*>/gi)].map(m => m[0]);
  const linksWithOnclick = [...html.matchAll(/<a[^>]*onclick=[^>]*>[\s\S]*?<\/a>/gi)].map(m => m[0]);
  
  return {
    forms: forms.map(f => {
      const nameMatch = f.match(/name=["']([^"']+)["']/);
      const actionMatch = f.match(/action=["']([^"']+)["']/);
      const methodMatch = f.match(/method=["']([^"']+)["']/);
      return {
        name: nameMatch ? nameMatch[1] : '',
        action: actionMatch ? actionMatch[1] : '',
        method: methodMatch ? methodMatch[1] : ''
      };
    }),
    inputs: inputs.map(i => {
      const typeMatch = i.match(/type=["']([^"']+)["']/);
      const nameMatch = i.match(/name=["']([^"']+)["']/);
      const idMatch = i.match(/id=["']([^"']+)["']/);
      const valueMatch = i.match(/value=["']([^"']*)["']/);
      return {
        type: typeMatch ? typeMatch[1] : 'text',
        name: nameMatch ? nameMatch[1] : '',
        id: idMatch ? idMatch[1] : '',
        value: valueMatch ? valueMatch[1] : ''
      };
    }),
    selects: selects.map(s => {
      const nameMatch = s.match(/name=["']([^"']+)["']/);
      const idMatch = s.match(/id=["']([^"']+)["']/);
      const options = [...s.matchAll(/<option[^>]*value=["']([^"']*)["'][^>]*>(.*?)<\/option>/gi)].map(o => ({
        value: o[1],
        text: o[2].trim()
      }));
      return {
        name: nameMatch ? nameMatch[1] : '',
        id: idMatch ? idMatch[1] : '',
        optionsCount: options.length,
        options: options
      };
    }),
    buttons: buttons.map(b => b.replace(/<[^>]+>/g, '').trim()),
    onclicks: linksWithOnclick.map(l => {
      const oc = l.match(/onclick=["']([^"']+)["']/);
      return oc ? oc[1] : '';
    })
  };
}

const spec = {
  lists: extractFormSpec('scratch/target_ad_abs_lists.html'),
  write: extractFormSpec('scratch/target_ad_abs_write.html')
};

fs.writeFileSync('scratch/spec_ad_abs.json', JSON.stringify(spec, null, 2), 'utf8');
console.log('Saved scratch/spec_ad_abs.json successfully!');
console.log('Lists inputs count:', spec.lists.inputs.length);
console.log('Write inputs count:', spec.write.inputs.length);
