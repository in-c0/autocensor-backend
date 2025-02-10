// tests/e2e/fileUpload.spec.js
describe('File Upload', () => {
    it('should upload a file and display progress', () => {
      cy.visit('/');
      cy.get('input[type="file"]').attachFile('sample-video.mp4');
      cy.get('button').contains('Upload File').click();
      cy.get('progress').should('exist').and(($prog) => {
        const val = $prog.attr('value');
        expect(Number(val)).to.be.greaterThan(0);
      });
    });
  });
  